
// src/app/products/page.tsx
'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlidersHorizontal, Search, X, Filter, ShieldAlert, ShoppingCart, Loader2, Check, PanelLeftClose, Tag, PackageCheck, Info } from 'lucide-react';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useCart, type CartProduct } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { getProducts, type Product } from '@/lib/firebaseServices';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const filterOptions = {
  categories: ['Refrigerants', 'Manifold Gauges', 'Recovery Equipment', 'Vacuum Pumps', 'Leak Detectors', 'Hoses & Fittings', 'Tools & Gauges', 'Accessories'],
  refrigerantTypes: ['HFC', 'HFO', 'HCFC Alternatives', 'Natural Refrigerants', 'Other Gases'],
  applications: ['Residential AC', 'Commercial AC', 'Commercial Refrigeration', 'Automotive AC', 'Chillers', 'HVAC Tools', 'Industrial Refrigeration', 'Welding', 'Medical'],
  availability: ['In Stock', 'Out of Stock', 'Pre-Order'],
  priceRanges: [
    { label: 'Under $100', value: '0-99.99' },
    { label: '$100 - $249.99', value: '100-249.99' },
    { label: '$250 - $499.99', value: '250-499.99' },
    { label: '$500 - $999.99', value: '500-999.99' },
    { label: 'Over $1000', value: '1000-' },
  ],
};

interface DemoProductDetails {
  uniqueTitle: string;
  uniqueDescription: string;
  dataAiHint: string;
  originalNameMatcher: string; 
  category?: string; 
}

const demonstrationProductDetails: DemoProductDetails[] = [
  // Provided examples (Original 5 + New 10 = 15)
  {
    originalNameMatcher: "R-410A", category: "Refrigerants",
    uniqueTitle: "Climabec Eco-Friendly R-410A Cooling Gas - Efficient HVAC Solution",
    uniqueDescription: "Experience top-tier cooling with Climabec's R-410A refrigerant, designed for high performance and environmental safety in modern air conditioning systems. Durable and reliable, perfect for residential and commercial use.",
    dataAiHint: "technician handling r410a cylinder"
  },
  {
    originalNameMatcher: "R-22", category: "Refrigerants",
    uniqueTitle: "Climabec Advanced R-22 Alternative Refrigerant - Reliable AC Performance",
    uniqueDescription: "Climabec’s R-22 alternative refrigerant delivers powerful and consistent cooling, formulated to meet strict industry standards while ensuring system longevity and efficiency. Trusted by professionals worldwide.",
    dataAiHint: "hvac technician servicing ac unit"
  },
  {
    originalNameMatcher: "R-134a", category: "Refrigerants",
    uniqueTitle: "Climabec R-134a Refrigerant - Premium Refrigeration Gas",
    uniqueDescription: "Designed for automotive and refrigeration applications, Climabec’s R-134a gas offers excellent thermal properties and smooth system operation with a focus on safety and compliance.",
    dataAiHint: "automotive ac refrigerant r134a"
  },
  {
    originalNameMatcher: "Scale", category: "Accessories", // Assuming 'Refrigerant Scale'
    uniqueTitle: "Climabec Precision Refrigerant Scale - Accurate Measurement Tool",
    uniqueDescription: "Ensure precise refrigerant charging with Climabec’s professional-grade scale, engineered for accuracy, durability, and ease of use in all HVAC service environments.",
    dataAiHint: "refrigerant scale hvac tool in use"
  },
  {
    originalNameMatcher: "Leak Detector", category: "Accessories",
    uniqueTitle: "Climabec Digital Refrigerant Leak Detector - Fast & Reliable",
    uniqueDescription: "Quickly identify leaks in HVAC systems with Climabec’s sensitive digital leak detector, providing accurate readings and helping to maintain system efficiency and safety.",
    dataAiHint: "digital refrigerant leak detector closeup"
  },
  {
    originalNameMatcher: "R-404A", category: "Refrigerants",
    uniqueTitle: "Climabec ProChill R-404A Refrigerant - Optimal Low-Temp Performance",
    uniqueDescription: "Ensure reliable and efficient cooling for commercial freezers and refrigeration units with Climabec's ProChill R-404A. Formulated for consistent low-temperature applications.",
    dataAiHint: "commercial refrigeration unit r404a"
  },
  {
    originalNameMatcher: "R-407C", category: "Refrigerants",
    uniqueTitle: "Climabec VersaChill R-407C - Versatile AC Refrigerant",
    uniqueDescription: "Climabec's VersaChill R-407C is an ideal HFC retrofit for R-22 in various air conditioning systems, offering excellent cooling capacity and energy efficiency.",
    dataAiHint: "hvac technician checking gauges r407c"
  },
  {
    originalNameMatcher: "R-507", category: "Refrigerants",
    uniqueTitle: "Climabec UltraFreeze R-507 - Superior Refrigeration Power",
    uniqueDescription: "For demanding low and medium-temperature commercial refrigeration, Climabec's UltraFreeze R-507 provides robust and dependable cooling performance.",
    dataAiHint: "refrigerant cylinders r507 warehouse"
  },
  {
    originalNameMatcher: "R-32", category: "Refrigerants",
    uniqueTitle: "Climabec EcoSmart R-32 Refrigerant - Lower GWP AC Solution",
    uniqueDescription: "Choose Climabec's EcoSmart R-32 for a lower GWP air conditioning refrigerant. Delivers high efficiency and performance in modern compatible systems.",
    dataAiHint: "modern ac unit r32 installation"
  },
  {
    originalNameMatcher: "Recovery Machine", category: "Accessories",
    uniqueTitle: "Climabec SpeedReclaim Refrigerant Recovery Unit - EPA Compliant",
    uniqueDescription: "Expedite refrigerant recovery with Climabec's SpeedReclaim machine. Built for durability and compliance, making HVAC/R jobs faster and more efficient.",
    dataAiHint: "refrigerant recovery machine in use technician"
  },
  {
    originalNameMatcher: "Vacuum Pump", category: "Accessories", // More specific than "Vacuum Pumps"
    uniqueTitle: "Climabec DeepVac Pro Vacuum Pump - HVAC System Evacuation",
    uniqueDescription: "Achieve deep system evacuation with Climabec's DeepVac Pro vacuum pump. Essential for ensuring HVAC/R system purity and optimal performance.",
    dataAiHint: "hvac vacuum pump service"
  },
  {
    originalNameMatcher: "Manifold Gauge Set", category: "Accessories",
    uniqueTitle: "Climabec PrecisionFlow Manifold Gauge Set - Accurate HVAC Readings",
    uniqueDescription: "Climabec's PrecisionFlow manifold gauge set provides accurate pressure readings for diagnosing and servicing HVAC/R systems. Durable and easy to use.",
    dataAiHint: "manifold gauge set hvac technician"
  },
  {
    originalNameMatcher: "Refrigerant Hoses", category: "Accessories", // More specific than "Hoses & Fittings"
    uniqueTitle: "Climabec DuraFlex Refrigerant Hoses - Secure HVAC Connections",
    uniqueDescription: "Ensure leak-free connections with Climabec's DuraFlex refrigerant hoses. Designed for high pressure and long-lasting durability in demanding HVAC applications.",
    dataAiHint: "refrigerant hoses connected manifold"
  },
  {
    originalNameMatcher: "Micron Gauge", category: "Accessories",
    uniqueTitle: "Climabec AccuVac Digital Micron Gauge - Precise Vacuum Measurement",
    uniqueDescription: "Monitor HVAC system evacuation accurately with Climabec's AccuVac digital micron gauge. Essential for confirming proper vacuum levels before charging.",
    dataAiHint: "digital micron gauge technician hands"
  },
  {
    originalNameMatcher: "Cylinder", category: "Refrigerants", // Generic for refrigerant cylinders
    uniqueTitle: "Climabec Universal Refrigerant Cylinder - Safe & Certified Storage",
    uniqueDescription: "Climabec's DOT-certified universal refrigerant cylinders ensure safe storage and transport of various refrigerants. Available in multiple sizes for professional use.",
    dataAiHint: "stack of refrigerant cylinders"
  },
  // New Products based on user list
  {
    originalNameMatcher: "R290", category: "Refrigerants",
    uniqueTitle: "Climabec NaturaChill R-290 Propane Refrigerant (13.6kg) - Eco-Cooling",
    uniqueDescription: "Climabec's R-290 (Propane) offers an ultra-low GWP cooling solution for compatible systems. Pure, efficient, and environmentally conscious for specialized refrigeration applications.",
    dataAiHint: "propane tank r290 label"
  },
  {
    originalNameMatcher: "R600a", category: "Refrigerants",
    uniqueTitle: "Climabec IsoBoost R-600a Isobutane Refrigerant (13.6kg) - High-Efficiency Natural",
    uniqueDescription: "Harness the power of natural refrigerants with Climabec's R-600a Isobutane. Ideal for domestic and light commercial units, providing excellent energy savings and minimal environmental impact.",
    dataAiHint: "isobutane cylinder r600a blue"
  },
  {
    originalNameMatcher: "Nitrogen Gas Cylinder", category: "Refrigerants", // or "Gases"
    uniqueTitle: "Climabec PurgeMax Nitrogen Gas Cylinder (Various Sizes) - HVAC System Purity",
    uniqueDescription: "Ensure HVAC system integrity with Climabec's high-purity Nitrogen. Perfect for purging, pressure testing, and brazing. Available in multiple convenient cylinder sizes for professional use.",
    dataAiHint: "technician using nitrogen cylinder hvac"
  },
  {
    originalNameMatcher: "Argon Gas Cylinder", category: "Refrigerants", // or "Gases"
    uniqueTitle: "Climabec WeldArc Argon Gas Cylinder (Various Sizes) - Precision Welding Shield",
    uniqueDescription: "Achieve superior TIG and MIG welds with Climabec's WeldArc Argon gas. Provides a stable arc and clean results for professional fabricators. Various cylinder sizes available.",
    dataAiHint: "welder with argon tank setup"
  },
  {
    originalNameMatcher: "Oxygen Gas Cylinder", category: "Refrigerants", // or "Gases"
    uniqueTitle: "Climabec OxyFlame Oxygen Gas Cylinder (Various Sizes) - Industrial Brazing & Cutting",
    uniqueDescription: "Climabec's industrial-grade Oxygen supports high-temperature brazing, cutting, and welding. Ensure purity and performance for your metalworking projects. Multiple sizes offered.",
    dataAiHint: "oxygen tank industrial setup"
  },
  {
    originalNameMatcher: "Acetylene Gas Cylinder", category: "Refrigerants", // or "Gases"
    uniqueTitle: "Climabec MaxHeat Acetylene Gas Cylinder (Various Sizes) - High-Temp Metalwork",
    uniqueDescription: "For demanding cutting and welding, Climabec's MaxHeat Acetylene delivers superior flame temperature and efficiency. Handle with care. Available in various professional cylinder sizes.",
    dataAiHint: "acetylene cylinder with torch"
  },
  {
    originalNameMatcher: "CO2 Gas Cylinder", category: "Refrigerants", // or "Gases"
    uniqueTitle: "Climabec FizzFlow CO2 Gas Cylinder (Various Sizes) - Beverage & Industrial Use",
    uniqueDescription: "Food-grade Carbon Dioxide by Climabec, perfect for beverage carbonation, shielded welding, and diverse industrial applications. Pure and reliable. Multiple cylinder sizes.",
    dataAiHint: "co2 tank for beverage carbonation"
  },
  {
    originalNameMatcher: "Recovery Equipment", category: "Accessories", // This is broad; the specific "Recovery Machine" is already listed
    uniqueTitle: "Climabec Complete Refrigerant Recovery Systems - Full HVAC Solutions",
    uniqueDescription: "Explore Climabec's range of EPA-compliant refrigerant recovery systems, including machines, tanks, and accessories. Ensure fast, safe, and efficient recovery for all refrigerant types.",
    dataAiHint: "hvac recovery system components"
  },
  {
    originalNameMatcher: "Refrigeration Recovery Cylinder", category: "Accessories",
    uniqueTitle: "Climabec SecureStore Recovery Cylinder (DOT Certified) - Safe Refrigerant Management",
    uniqueDescription: "DOT-certified refrigerant recovery cylinders by Climabec. Designed for secure storage and transport of recovered refrigerants. Features dual-port options and robust construction for professional use.",
    dataAiHint: "yellow hvac recovery tank closeup"
  },
  {
    originalNameMatcher: "Vacuum Pumps", category: "Accessories", // Broad term; specific "Vacuum Pump" is already listed
    uniqueTitle: "Climabec DeepEvac Vacuum Pump Series - For HVAC System Integrity",
    uniqueDescription: "Achieve optimal system dehydration with Climabec's DeepEvac series of high-performance vacuum pumps. Essential for removing moisture and non-condensables before charging any HVAC/R system.",
    dataAiHint: "various hvac vacuum pumps lineup"
  },
  {
    originalNameMatcher: "Leak Detector Spray", category: "Accessories",
    uniqueTitle: "Climabec BubbleTest Leak Detector Spray - Instant Visual Indication",
    uniqueDescription: "Quickly and easily locate refrigerant leaks with Climabec's BubbleTest spray. Forms highly visible bubbles at leak points. Non-corrosive and safe for all HVAC/R system components.",
    dataAiHint: "technician spraying leak detector on pipe"
  },
  {
    originalNameMatcher: "Recharge Hose", category: "Accessories",
    uniqueTitle: "Climabec AutoCharge R-134a Recharge Hose with Gauge - DIY Car AC Service",
    uniqueDescription: "Climabec's AutoCharge hose simplifies R-134a automotive AC recharging. Features an integrated pressure gauge and easy-to-use coupler for safe and effective DIY servicing.",
    dataAiHint: "car ac recharge hose with gauge"
  },
  {
    originalNameMatcher: "Charging Hose with Coupler", category: "Accessories", // More generic
    uniqueTitle: "Climabec ProConnect Charging Hose with Quick Coupler - Universal HVAC",
    uniqueDescription: "Versatile charging hose with quick-connect coupler by Climabec. Suitable for various refrigerants and HVAC/R systems, providing secure and efficient connections.",
    dataAiHint: "hvac charging hose and coupler"
  },
  {
    originalNameMatcher: "Pressure Gauge", category: "Accessories",
    uniqueTitle: "Climabec ReadEasy Pressure Gauge - HVAC System Monitoring Tool",
    uniqueDescription: "High-precision, durable pressure gauge from Climabec for accurate monitoring of HVAC/R system pressures. Features a clear, easy-to-read display and standard fittings.",
    dataAiHint: "hvac pressure gauge closeup detail"
  },
  {
    originalNameMatcher: "Tube Cutter", category: "Accessories",
    uniqueTitle: "Climabec CleanCut Copper & Aluminum Tube Cutter - Precision HVAC Tool",
    uniqueDescription: "Achieve clean, burr-free cuts on copper and aluminum tubing with Climabec's CleanCut tool. Essential for professional HVAC installations ensuring leak-proof connections.",
    dataAiHint: "hand using tube cutter on copper pipe"
  },
  {
    originalNameMatcher: "Pipe Bender", category: "Accessories",
    uniqueTitle: "Climabec FormFlex Multi-Size Pipe Bender Kit - Custom HVAC Tubing",
    uniqueDescription: "Climabec's FormFlex pipe bender kit allows for accurate, smooth bends in various sizes of copper and aluminum tubing. Perfect for custom HVAC/R installations and precise routing.",
    dataAiHint: "pipe bender kit with copper tubes"
  },
  {
    originalNameMatcher: "Brazing Torch Kit", category: "Accessories",
    uniqueTitle: "Climabec PyroWeld Brazing & Soldering Torch Kit - High-Temp HVAC Joining",
    uniqueDescription: "Professional-grade brazing and soldering torch kit from Climabec. Delivers a stable, high-temperature flame for strong, reliable joints in HVAC/R copper piping. Includes multiple tips and igniter.",
    dataAiHint: "brazing torch flame on copper pipe"
  },
  {
    originalNameMatcher: "Flare Tool Set", category: "Accessories",
    uniqueTitle: "Climabec SealTight Flaring Tool Set - Leak-Proof HVAC Connections",
    uniqueDescription: "Create perfect 45-degree flares on copper tubing with Climabec's SealTight tool set. Ensures tight, leak-proof connections for refrigerant lines. Durable steel construction for long service life.",
    dataAiHint: "flaring tool in action on copper pipe"
  },
  {
    originalNameMatcher: "Insulation Tape", category: "Accessories",
    uniqueTitle: "Climabec ArmorFlex HVAC Insulation Tape - Line Protection & Efficiency",
    uniqueDescription: "High-quality, UV-resistant insulation tape from Climabec for wrapping refrigerant lines. Prevents condensation, improves system efficiency, and protects piping from environmental damage.",
    dataAiHint: "hand wrapping insulation tape on ac line"
  },
  {
    originalNameMatcher: "Service Valve", category: "Accessories",
    uniqueTitle: "Climabec QuickTap Service Valve - HVAC System Access Point Tool",
    uniqueDescription: "Durable brass service valves from Climabec provide reliable access points for charging, recovery, and diagnostics in HVAC/R systems. Available in various sizes and connection types.",
    dataAiHint: "hvac service valve on unit"
  },
  {
    originalNameMatcher: "Expansion Valve", category: "Accessories",
    uniqueTitle: "Climabec FlowTune Thermostatic Expansion Valve (TXV) - Precise Refrigerant Control",
    uniqueDescription: "Climabec's FlowTune TXVs ensure precise refrigerant flow control, optimizing HVAC system efficiency and superheat. Wide range of capacities and refrigerant compatibilities available.",
    dataAiHint: "thermostatic expansion valve component"
  },
  {
    originalNameMatcher: "Thermostat Controller", category: "Accessories",
    uniqueTitle: "Climabec SmartTemp Digital Thermostat Controller - Programmable Climate Management",
    uniqueDescription: "Manage indoor environments effectively with Climabec's SmartTemp digital thermostat. Features programmable schedules, clear backlit display, and compatibility with most residential and commercial HVAC systems.",
    dataAiHint: "digital thermostat displaying temperature"
  },
  {
    originalNameMatcher: "Thermocouple Sensor", category: "Accessories",
    uniqueTitle: "Climabec ProbeSense K-Type Thermocouple Sensor - Accurate HVAC Temperature Readings",
    uniqueDescription: "Reliable K-Type thermocouple sensor from Climabec for accurate temperature measurement in HVAC/R diagnostics, air balancing, and system monitoring. Compatible with most digital thermometers.",
    dataAiHint: "thermocouple probe measuring air temp"
  },
  {
    originalNameMatcher: "Condenser Fan Motor", category: "Accessories",
    uniqueTitle: "Climabec CoolFlow Condenser Fan Motor - Efficient HVAC Heat Exchange",
    uniqueDescription: "High-performance condenser fan motors by Climabec. Designed for durability and efficient heat dissipation in AC and refrigeration condensing units. Various HP, RPM, and mounting options.",
    dataAiHint: "ac condenser unit fan spinning"
  },
  {
    originalNameMatcher: "Compressor Motor", category: "Accessories",
    uniqueTitle: "Climabec DuraDrive Compressor Motor - Reliable HVAC System Heart",
    uniqueDescription: "Robust and reliable compressor motors from Climabec, the core of your HVAC/R system. Engineered for long service life and energy efficiency. Ensure proper model matching for replacement.",
    dataAiHint: "hvac compressor unit internal motor"
  },
  {
    originalNameMatcher: "Air Filter Drier", category: "Accessories",
    uniqueTitle: "Climabec DryShield Filter Drier - Refrigerant System Contaminant Protection",
    uniqueDescription: "Protect your HVAC/R system from moisture, acid, and solid contaminants with Climabec's DryShield filter driers. Essential for system longevity and optimal performance. Various sizes and connection types.",
    dataAiHint: "hvac filter drier installed in line"
  },
  {
    originalNameMatcher: "Sight Glass", category: "Accessories",
    uniqueTitle: "Climabec VisiCharge Sight Glass with Moisture Indicator - System Health Check",
    uniqueDescription: "Climabec's VisiCharge sight glass allows for easy visual inspection of refrigerant flow and critical moisture content. Essential for diagnosing system health and ensuring proper charge levels.",
    dataAiHint: "hvac sight glass showing bubbles"
  },
  {
    originalNameMatcher: "Solenoid Valve", category: "Accessories",
    uniqueTitle: "Climabec ElectroFlow Solenoid Valve - Automated Refrigerant Flow Control",
    uniqueDescription: "Reliable solenoid valves from Climabec for precise, automated control of refrigerant flow in various HVAC/R applications. Available in normally open and normally closed configurations, various coil voltages.",
    dataAiHint: "solenoid valve electrical component hvac"
  },
  {
    originalNameMatcher: "Electronic Expansion Valve", category: "Accessories",
    uniqueTitle: "Climabec IntelliGlide Electronic Expansion Valve (EEV) - Advanced Refrigerant Metering",
    uniqueDescription: "Optimize HVAC/R system superheat and energy efficiency with Climabec's IntelliGlide EEV. Provides precise electronic control over refrigerant flow for superior performance in modern systems.",
    dataAiHint: "electronic expansion valve eev closeup"
  },
  {
    originalNameMatcher: "Capillary Tube", category: "Accessories",
    uniqueTitle: "Climabec MicroBore Capillary Tube Coil - Precision Refrigerant Metering",
    uniqueDescription: "High-quality, precision-drawn capillary tubes from Climabec for refrigerant metering in smaller refrigeration systems and appliances. Available in various lengths and internal diameters.",
    dataAiHint: "coiled copper capillary tube"
  },
  {
    originalNameMatcher: "Refrigerant Tank", category: "Accessories", // For generic accessory tanks
    uniqueTitle: "Climabec TransStore DOT Refrigerant Cylinder (Various Sizes) - Compliant Gas Transport",
    uniqueDescription: "Climabec's DOT-approved refrigerant cylinders ensure safe and compliant storage and transport of various refrigerants. Durable construction, multiple sizes for professional field use.",
    dataAiHint: "empty refrigerant tanks various sizes"
  },
  {
    originalNameMatcher: "Refrigeration Thermometer", category: "Accessories",
    uniqueTitle: "Climabec ThermoSense Digital Refrigeration Thermometer Kit - Accurate Temperature Diagnostics",
    uniqueDescription: "Climabec's ThermoSense digital thermometer kit provides fast, accurate temperature readings for refrigeration service. Includes clamp and penetration probes for comprehensive diagnostics.",
    dataAiHint: "digital thermometer with probes hvac"
  },
  {
    originalNameMatcher: "HVAC Digital Multimeter", category: "Accessories",
    uniqueTitle: "Climabec AmpPro HVAC Digital Multimeter - Full Electrical Diagnostics",
    uniqueDescription: "The AmpPro HVAC digital multimeter by Climabec is essential for any technician. Measures voltage, current, resistance, capacitance, frequency, and temperature for complete electrical troubleshooting.",
    dataAiHint: "hvac multimeter measuring voltage"
  },
  {
    originalNameMatcher: "Vacuum Gauge", category: "Accessories", // More generic, if micron gauge is too specific
    uniqueTitle: "Climabec EvacCheck Analog Vacuum Gauge - System Evacuation Monitoring",
    uniqueDescription: "Reliable analog vacuum gauge from Climabec for monitoring HVAC system evacuation. Durable and easy-to-read, ensuring proper dehydration before refrigerant charging.",
    dataAiHint: "analog vacuum gauge hvac tool"
  },
  {
    originalNameMatcher: "Refrigeration Tools Kit", category: "Accessories",
    uniqueTitle: "Climabec MasterTech HVAC Refrigeration Service Tool Kit - All-In-One Solution",
    uniqueDescription: "Climabec's MasterTech Kit offers a complete set of essential refrigeration tools: manifold gauges, tube cutter, flaring tool, bender, deburring tool, and more, in a rugged carrying case.",
    dataAiHint: "open hvac tool kit contents"
  },
  {
    originalNameMatcher: "Welding Gas Regulator", category: "Accessories",
    uniqueTitle: "Climabec GasGuard Welding Gas Regulator - Precise Flow for Brazing & Welding",
    uniqueDescription: "Achieve precise and consistent gas flow control for welding, brazing, and purging with Climabec's GasGuard regulators. Designed for durability and accuracy with Argon, CO2, Nitrogen.",
    dataAiHint: "gas regulator on argon tank"
  }
];


function ProductPageContentInternal() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: [], refrigerantTypes: [], applications: [], availability: [], priceRanges: []
  });
  const { addToCart, isItemInCart } = useCart();
  const { toast } = useToast();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { isMobile, open: isDesktopSidebarOpen } = useSidebar();
  const [pageIsMounted, setPageIsMounted] = useState(false);

  useEffect(() => {
    setPageIsMounted(true);
    document.title = 'Freon™ Refrigerants & HVAC/R Accessories | Aether Industries';
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      const productsFromDb = await getProducts();
      console.log("[ProductPage] Fetched products from Firestore:", productsFromDb); 
      setAllProducts(productsFromDb);
      setIsLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType] || [];
      let newFilters = { ...prev };
      if (filterType === 'categories') {
        const newCategories = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
        newFilters.categories = newCategories;
        if (!newCategories.includes('Refrigerants')) {
          newFilters.refrigerantTypes = []; // Clear refrigerant types if 'Refrigerants' category is deselected
        }
      } else {
         newFilters = {
          ...prev,
          [filterType]: currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]
        };
      }
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters({ categories: [], refrigerantTypes: [], applications: [], availability: [], priceRanges: [] });
    setSearchTerm('');
  }, []);

  const filteredProducts = useMemo(() => {
    if (!pageIsMounted || isLoadingProducts || !allProducts) return [];
    console.log("[ProductPage] 'allProducts' at start of filtering:", allProducts);

    // DEBUG: Temporarily return all products to isolate data fetching vs. filtering
    // return allProducts; 

    if (allProducts.length === 0) return [];
    
    let productsToFilter = allProducts;

    // Apply search term filter
    if (searchTerm.trim() !== '') {
      productsToFilter = productsToFilter.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedFilters.categories.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        selectedFilters.categories.includes(product.category)
      );
    }

    // Apply refrigerant type filter (only if 'Refrigerants' category is selected or no category filter)
    if (selectedFilters.refrigerantTypes.length > 0 && 
        (selectedFilters.categories.length === 0 || selectedFilters.categories.includes('Refrigerants'))) {
      productsToFilter = productsToFilter.filter(product =>
        product.refrigerantType && selectedFilters.refrigerantTypes.includes(product.refrigerantType)
      );
    }
    
    // Apply application filter
    if (selectedFilters.applications.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        product.application && selectedFilters.applications.includes(product.application)
      );
    }

    // Apply availability filter
    if (selectedFilters.availability.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        selectedFilters.availability.includes(product.availability)
      );
    }
    
    // Apply price range filter
    if (selectedFilters.priceRanges.length > 0) {
      productsToFilter = productsToFilter.filter(product => {
        if (product.price === null || product.price === undefined) return false; // Products without price don't match price filters
        return selectedFilters.priceRanges.some(range => {
          const [minStr, maxStr] = range.split('-');
          const min = parseFloat(minStr);
          const max = maxStr ? parseFloat(maxStr) : Infinity;
          if (isNaN(max)) return product.price >= min;
          return product.price >= min && product.price <= max;
        });
      });
    }
    
    console.log(`[ProductPage] Filtered down to ${productsToFilter.length} products.`);
    return productsToFilter;

  }, [allProducts, searchTerm, selectedFilters, pageIsMounted, isLoadingProducts]);


  const activeFilterCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0) + (searchTerm ? 1 : 0);
  }, [selectedFilters, searchTerm]);

  const handleAddToCartList = useCallback((product: Product) => {
    if (!product.isPurchasable || product.availability === 'Out of Stock') return;

    setAddingProductId(product.id);
    setAddedProductId(null);

    const productDetails: CartProduct = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.images?.[0]?.url || 'https://placehold.co/100x100.png',
      dataAiHint: product.images?.[0]?.dataAiHint || 'product image',
      price: product.price,
      isQuoteItem: !product.isPurchasable,
      requiresCertification: product.requiresCertification,
    };

    setTimeout(() => {
      addToCart(productDetails, 1);
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
        action: <Link href="/cart"><Button variant="outline" size="sm">View Cart</Button></Link>,
      });
      setAddingProductId(null);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2000);
    }, 700);
  }, [addToCart, toast]);

  const FilterGroup = ({ title, options, filterType }: { title: string; options: {label: string, value: string}[] | string[]; filterType: string }) => (
    <AccordionItem value={filterType}>
      <AccordionTrigger className="text-sm font-semibold hover:text-accent py-3">{title}</AccordionTrigger>
      <AccordionContent className="pt-1 pb-2 px-1">
        <div className="space-y-2">
          {options.map(opt => {
            const optionValue = typeof opt === 'string' ? opt : opt.value;
            const optionLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <div key={optionValue} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterType}-${optionValue.replace(/\s+/g, '-').toLowerCase()}`}
                  checked={selectedFilters[filterType]?.includes(optionValue)}
                  onCheckedChange={() => handleFilterChange(filterType, optionValue)}
                />
                <Label htmlFor={`${filterType}-${optionValue.replace(/\s+/g, '-').toLowerCase()}`} className="text-xs font-normal cursor-pointer">
                  {optionLabel}
                </Label>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const FiltersComponent = () => (
    <Accordion type="multiple" className="w-full space-y-1" defaultValue={['categories', 'availability']}>
      <div className="px-1 pb-2">
        <Label htmlFor="search-products" className="text-sm font-semibold mb-1 block">Search Products</Label>
        <div className="relative">
            <Input
            id="search-products"
            type="text"
            placeholder="Search by name, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs"
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <FilterGroup title="Categories" options={filterOptions.categories} filterType="categories" />
      {(selectedFilters.categories.length === 0 || selectedFilters.categories.includes('Refrigerants')) && (
        <FilterGroup title="Refrigerant Types" options={filterOptions.refrigerantTypes} filterType="refrigerantTypes" />
      )}
      <FilterGroup title="Applications" options={filterOptions.applications} filterType="applications" />
      <FilterGroup title="Availability" options={filterOptions.availability} filterType="availability" />
      <FilterGroup title="Price Range" options={filterOptions.priceRanges} filterType="priceRanges" />
    </Accordion>
  );

  const ProductCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden h-full border shadow-sm">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-4 flex-grow space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto space-y-2">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
  
  useEffect(() => {
    if(pageIsMounted && !isLoadingProducts) {
        console.log("[ProductPage] Number of products to display after filtering:", filteredProducts.length);
    }
  }, [filteredProducts, pageIsMounted, isLoadingProducts]);


  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 break-words">Explore Refrigerants & HVAC/R Supplies</h1>
        <p className="text-lg text-muted-foreground break-words">
          Discover genuine Freon™ products, professional-grade tools, and essential accessories for all your cooling system needs.
        </p>
      </div>

      <Card className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-blue-500">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center text-blue-700 dark:text-blue-300">
            <ShieldAlert className="mr-3 h-6 w-6" /> Important: EPA Certification & Safe Handling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600 dark:text-blue-400 break-words">
            The purchase and use of most refrigerants (e.g., R-410A, R-134a, R-32, MO99) are subject to EPA Section 608 regulations.
            Ensure you possess valid certification and adhere to all safe handling practices.
            Aether Industries is committed to compliant sales.
            Review our <Link href="/disclaimers/refrigerant-certification" className="font-semibold underline hover:opacity-80">Refrigerant Certification Policy</Link>.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-primary hover:bg-primary/10" aria-label="Toggle Filters">
             {pageIsMounted && isMobile === false && isDesktopSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
            <span className="ml-1 text-sm font-medium md:hidden">Filters</span>
            {activeFilterCount > 0 && <Badge variant="secondary" className="md:hidden">{activeFilterCount}</Badge>}
          </SidebarTrigger>
          <span className="text-sm text-muted-foreground hidden md:inline">
            {isLoadingProducts ? 'Loading products...' : `${filteredProducts.length} products found`}
          </span>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-xs text-accent hover:text-accent/80">
            Clear All Filters ({activeFilterCount}) <X className="ml-1 h-3 w-3"/>
          </Button>
        )}
      </div>
      <span className="text-sm text-muted-foreground md:hidden mb-4 block">
        {isLoadingProducts ? 'Loading products...' : `${filteredProducts.length} products found`}
      </span>

      <div className="flex flex-col md:flex-row gap-8 md:items-start">
        <aside className="hidden md:block w-full md:w-[280px] lg:w-[320px] sticky top-20 self-start">
          <div className="p-1 rounded-lg border bg-card shadow-sm">
            <ScrollArea className="h-auto max-h-[calc(100vh-12rem)]">
              <div className="p-3">
                <FiltersComponent />
              </div>
            </ScrollArea>
          </div>
        </aside>

        <Sidebar collapsible="offcanvas" side="left" className="md:hidden">
          <ScrollArea className="h-full">
            <SidebarHeader className="border-b p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filter Products</h2>
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon"><X className="h-5 w-5"/></Button>
                </SidebarTrigger>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <FiltersComponent />
            </SidebarContent>
            <SidebarFooter className="p-4 border-t flex flex-col sm:flex-row gap-2">
              <Button onClick={clearFilters} variant="outline" className="w-full">Clear Filters</Button>
              <SidebarTrigger asChild><Button className="w-full">Show Results</Button></SidebarTrigger>
            </SidebarFooter>
          </ScrollArea>
        </Sidebar>

        <main className="flex-1 p-0 min-w-0">
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isCurrentlyAdding = addingProductId === product.id;
                const isCurrentlyAdded = addedProductId === product.id || (pageIsMounted && isItemInCart(product.id));
                
                // Using Firestore data directly for now
                const displayTitle = product.name;
                const displayDescription = product.shortDescription;
                const displayImage = product.images?.[0]?.url || 'https://placehold.co/600x400.png';
                const displayDataAiHint = product.images?.[0]?.dataAiHint || 'hvac product image';

                return (
                  <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full border rounded-lg">
                    <CardHeader className="p-0 relative">
                      <Link href={`/products/${product.slug}`} className="block aspect-video overflow-hidden">
                        <Image
                          src={displayImage}
                          alt={displayTitle}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={displayDataAiHint}
                        />
                      </Link>
                      <div className="absolute top-2 right-2 space-y-1.5 flex flex-col items-end">
                        {product.requiresCertification && (
                          <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-white text-xs shadow-md">
                            <ShieldAlert className="h-3.5 w-3.5 mr-1" /> EPA Cert. Req.
                          </Badge>
                        )}
                        {product.availability === 'Pre-Order' && (
                          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs shadow-md">Pre-Order</Badge>
                        )}
                        {product.availability === 'Out of Stock' && (
                          <Badge variant="secondary" className="text-xs shadow-md">Out of Stock</Badge>
                        )}
                        {product.availability === 'In Stock' && (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-xs shadow-md">
                            <PackageCheck className="h-3.5 w-3.5 mr-1"/> In Stock
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow space-y-2">
                      <Link
                        href={`/products?category=${encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="text-xs text-accent font-semibold tracking-wide uppercase hover:underline flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3"/>{product.category}
                      </Link>
                      <CardTitle className="font-headline text-lg mt-0.5 mb-1.5 line-clamp-2 leading-tight">
                        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">{displayTitle}</Link>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-3 text-muted-foreground">{displayDescription}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 pt-2 mt-auto flex flex-col items-stretch gap-2">
                      {product.price !== null && (
                        <p className="text-2xl font-bold text-primary text-center mb-2">${product.price?.toFixed(2)}</p>
                      )}
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium py-2.5">
                        <Link href={`/products/${product.slug}`}><Info className="h-4 w-4 mr-1.5"/>View Details</Link>
                      </Button>
                      {product.price !== null && product.isPurchasable && product.availability !== 'Out of Stock' && (
                        <Button
                          variant="outline"
                          className="w-full text-sm font-medium py-2.5"
                          onClick={() => handleAddToCartList(product)}
                          disabled={isCurrentlyAdding || isCurrentlyAdded}
                        >
                          {isCurrentlyAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          {isCurrentlyAdding ? 'Adding...' : isCurrentlyAdded ? <><Check className="h-4 w-4 mr-2" /> Added!</> : <><ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart</>}
                        </Button>
                      )}
                      {(!product.isPurchasable || product.availability === 'Out of Stock') && (
                        <Button variant="outline" className="w-full text-sm font-medium py-2.5" asChild={!product.isPurchasable} disabled={product.availability === 'Out of Stock'}>
                          {product.availability === 'Out of Stock' ? 
                            <span>Currently Unavailable</span> : 
                            <Link href={`/contact?subject=Quote for ${encodeURIComponent(product.name)}&sku=${product.sku}`}>Request Quote</Link>
                          }
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 col-span-full min-w-0 bg-card rounded-lg shadow-md">
              <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
              <h3 className="font-headline text-2xl font-semibold mb-3">No Products Match Your Criteria</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">We couldn't find any products matching your current search and filter selections. Try adjusting your filters or broadening your search terms.</p>
              <Button variant="outline" onClick={clearFilters} className="text-base">
                <X className="mr-2 h-4 w-4"/> Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <ProductPageContentInternal />
    </SidebarProvider>
  );
}
