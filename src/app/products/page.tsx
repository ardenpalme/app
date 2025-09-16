"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Monitor, ShoppingCart, Filter, Camera, Shield, CloudSun, CloudUpload, Eye } from "lucide-react"
import Image from "next/image"
import { useState, useMemo } from "react"
import Navbar from "@/app/_components/main_navbar"
import Footer from "@/app/_components/main_footer"

const products = [
  {
    id: 1,
    name: "UltraWide Digital Display 32:9",
    category: "Digital Screens",
    aspectRatio: "32:9",
    size: '49"',
    resolution: "5120x1440",
    price: "$2,499",
    image: "/products/ultrawide.jpg",
    description: "Ultra-wide format perfect for advertising banners and immersive content display",
    features: ["4K+ Resolution", "HDR Support", "24/7 Operation", "Remote Management"],
    inStock: true,
    detailedSpecs: {
      brightness: "700 cd/m²",
      contrast: "4000:1",
      viewingAngle: "178°/178°",
      connectivity: ["HDMI 2.0", "DisplayPort 1.4", "USB-C", "Ethernet"],
      powerConsumption: "180W",
      operatingTemp: "-20°C to 50°C",
      warranty: "3 years commercial",
      mounting: "VESA 400x200mm",
      weight: "18.5 kg",
    },
    applications: ["Retail advertising", "Transportation hubs", "Corporate lobbies", "Event venues"],
  },
  {
    id: 2,
    name: "Standard Landscape Display 16:9",
    category: "Digital Screens",
    aspectRatio: "16:9",
    size: '55"',
    resolution: "3840x2160",
    price: "$1,299",
    image: "/landscape-digital-signage-screen-16-9-aspect-ratio.jpg",
    description: "Most popular format for general advertising and content display",
    features: ["4K UHD", "Anti-Glare Coating", "Built-in Media Player", "WiFi Connectivity"],
    inStock: true,
    detailedSpecs: {
      brightness: "500 cd/m²",
      contrast: "3000:1",
      viewingAngle: "178°/178°",
      connectivity: ["HDMI 2.0", "USB 3.0", "WiFi 6", "Bluetooth 5.0"],
      powerConsumption: "150W",
      operatingTemp: "-10°C to 40°C",
      warranty: "2 years commercial",
      mounting: "VESA 400x400mm",
      weight: "24.2 kg",
    },
    applications: ["Retail stores", "Restaurants", "Office buildings", "Healthcare facilities"],
  },
  {
    id: 3,
    name: "Portrait Digital Display 9:16",
    category: "Digital Screens",
    aspectRatio: "9:16",
    size: '43"',
    resolution: "2160x3840",
    price: "$1,599",
    image: "/portrait-digital-signage-screen-9-16-vertical-aspe.jpg",
    description: "Vertical orientation ideal for wayfinding and menu displays",
    features: ["Portrait Mode", "Touch Capability", "Vandal Resistant", "IP65 Rating"],
    inStock: true,
    detailedSpecs: {
      brightness: "800 cd/m²",
      contrast: "4500:1",
      viewingAngle: "178°/178°",
      connectivity: ["HDMI 2.1", "USB-C", "Ethernet", "4G LTE"],
      powerConsumption: "120W",
      operatingTemp: "-30°C to 60°C",
      warranty: "3 years commercial",
      mounting: "VESA 200x200mm",
      weight: "16.8 kg",
    },
    applications: ["Wayfinding", "Menu boards", "Information kiosks", "Transit stations"],
  },
  {
    id: 4,
    name: "Square Format Display 1:1",
    category: "Digital Screens",
    aspectRatio: "1:1",
    size: '32"',
    resolution: "1920x1920",
    price: "$899",
    image: "/square-digital-signage-screen-1-1-aspect-ratio.jpg",
    description: "Unique square format for creative installations and social media content",
    features: ["Square Display", "Social Media Ready", "Compact Design", "Easy Installation"],
    inStock: false,
    detailedSpecs: {
      brightness: "450 cd/m²",
      contrast: "2500:1",
      viewingAngle: "170°/170°",
      connectivity: ["HDMI 1.4", "USB 2.0", "WiFi 5"],
      powerConsumption: "85W",
      operatingTemp: "0°C to 35°C",
      warranty: "2 years commercial",
      mounting: "VESA 200x200mm",
      weight: "8.5 kg",
    },
    applications: ["Art installations", "Social media displays", "Boutique retail", "Creative spaces"],
  },
  {
    id: 5,
    name: "Classic Display 4:3",
    category: "Digital Screens",
    aspectRatio: "4:3",
    size: '24"',
    resolution: "1600x1200",
    price: "$649",
    image: "/classic-digital-signage-screen-4-3-aspect-ratio.jpg",
    description: "Traditional format perfect for informational displays and kiosks",
    features: ["Classic Format", "High Brightness", "Long Lifespan", "Cost Effective"],
    inStock: true,
    detailedSpecs: {
      brightness: "600 cd/m²",
      contrast: "3500:1",
      viewingAngle: "170°/160°",
      connectivity: ["HDMI 1.4", "VGA", "USB 2.0"],
      powerConsumption: "65W",
      operatingTemp: "-5°C to 45°C",
      warranty: "3 years commercial",
      mounting: "VESA 100x100mm",
      weight: "5.2 kg",
    },
    applications: ["Information displays", "Small retail", "Office reception", "Educational institutions"],
  },
  {
    id: 6,
    name: "DOOH Interactive Totem",
    category: "DOOH Totem",
    aspectRatio: "9:16",
    size: '55"',
    resolution: "2160x3840",
    price: "$4,999",
    image: "/digital-out-of-home-dooh-interactive-totem-kiosk.jpg",
    description: "Full-height interactive totem with advanced audience analytics",
    features: ["Interactive Touch", "Audience Analytics", "Weather Resistant", "Anti-Vandal Design"],
    inStock: true,
    detailedSpecs: {
      brightness: "1000 cd/m²",
      contrast: "5000:1",
      viewingAngle: "178°/178°",
      connectivity: ["HDMI 2.1", "USB-C", "Ethernet", "5G", "WiFi 6E"],
      powerConsumption: "250W",
      operatingTemp: "-40°C to 70°C",
      warranty: "5 years commercial",
      mounting: "Floor-standing with security anchors",
      weight: "85 kg",
    },
    applications: ["Outdoor advertising", "Transit hubs", "Shopping centers", "Smart city initiatives"],
  },
  {
    id: 7,
    name: "Smart Checkout Display Stand",
    category: "Checkout Stand",
    aspectRatio: "16:9",
    size: '21.5"',
    resolution: "1920x1080",
    price: "$1,899",
    image: "/smart-checkout-display-stand-retail-point-of-sale.jpg",
    description: "Integrated checkout solution with customer-facing display and analytics",
    features: ["Dual Displays", "Payment Integration", "Customer Analytics", "Compact Footprint"],
    inStock: true,
    detailedSpecs: {
      brightness: "400 cd/m²",
      contrast: "2000:1",
      viewingAngle: "170°/160°",
      connectivity: ["HDMI 2.0", "USB 3.0", "Ethernet", "NFC", "Bluetooth"],
      powerConsumption: "95W",
      operatingTemp: "5°C to 35°C",
      warranty: "2 years commercial",
      mounting: "Integrated stand with adjustable height",
      weight: "12.5 kg",
    },
    applications: ["Retail checkout", "Quick service restaurants", "Self-service kiosks", "Customer service desks"],
  },
  {
    id: 8,
    name: "Cinematic Display 21:9",
    category: "Digital Screens",
    aspectRatio: "21:9",
    size: '34"',
    resolution: "3440x1440",
    price: "$1,799",
    image: "/cinematic-digital-signage-screen-21-9-ultrawide-as.jpg",
    description: "Cinematic ultrawide format for immersive video content and presentations",
    features: ["Cinematic Format", "HDR10 Support", "Low Latency", "Color Accurate"],
    inStock: true,
    detailedSpecs: {
      brightness: "550 cd/m²",
      contrast: "3500:1",
      viewingAngle: "178°/178°",
      connectivity: ["HDMI 2.1", "DisplayPort 1.4", "USB-C", "Thunderbolt 4"],
      powerConsumption: "140W",
      operatingTemp: "-15°C to 45°C",
      warranty: "3 years commercial",
      mounting: "VESA 300x100mm",
      weight: "14.2 kg",
    },
    applications: ["Cinema lobbies", "Entertainment venues", "Corporate presentations", "Immersive experiences"],
  },
]

const categories = ["All", "Digital Screens", "DOOH Totem", "Checkout Stand"]
const aspectRatios = ["All", "16:9", "9:16", "21:9", "32:9", "4:3", "1:1"]

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesAspectRatio = selectedAspectRatio === "All" || product.aspectRatio === selectedAspectRatio

      return matchesSearch && matchesCategory && matchesAspectRatio
    })
  }, [searchTerm, selectedCategory, selectedAspectRatio])


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-br from-muted/50 to-muted">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Smart Digital Displays
              </h2>
              <div className="flex flex-col mb-6">
                <p className="text-lg text-muted-foreground">
                  Capture viewer attention with screens that stand out. 
                </p>
                <p className="text-lg text-muted-foreground">
                  Run the best ad and monetize impressions automatically.
                </p>
              </div>
              <div className="flex flex-col gap-y-2 text-base font-medium text-primary">
                <div className="flex flex-row space-x-2 items-center">
                  <Camera className="h-5 w-5" />
                  <span> Integrated computer vision system </span>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <Eye className="h-5 w-5" />
                  <span> Verifiable footfall and impressions </span>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <CloudUpload className="h-5 w-5" />
                  <span> SSP integrations for programmatic DOOH </span>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <Shield className="h-5 w-5" />
                  <span> GDPR & CCPA certified </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src="/images/signage_walkway.jpg"
                alt="Smart digital display"
                className="rounded-2xl shadow-lg max-h-[400px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full py-12 bg-background">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="border rounded-lg p-6 bg-card">
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Products ({filteredProducts.length})</h3>
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </Button>
                </div>
              </div>

              {/* Filter Bar */}
              {showFilters && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-foreground">Category:</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-foreground">Aspect Ratio:</label>
                      <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {aspectRatios.map((ratio) => (
                            <SelectItem key={ratio} value={ratio}>
                              {ratio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {searchTerm && <div className="text-sm text-muted-foreground">Showing results for "{searchTerm}"</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Dialog key={product.id}>
                  <DialogTrigger asChild>
                    <div className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer border rounded-lg bg-card overflow-hidden">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-2 right-2">
                          {product.inStock ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="outline" className="bg-background/90">
                            {product.aspectRatio}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-3">
                          <div>
                            <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              {product.category} • {product.size} • {product.resolution}
                            </CardDescription>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {product.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - 2} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-2xl font-bold text-foreground">{product.price}</span>
                            <Button
                              size="sm"
                              disabled={!product.inStock}
                              className="flex items-center space-x-1"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent dialog from opening when clicking Add to Cart
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span>Add</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{product.name}</DialogTitle>
                      <DialogDescription className="text-lg">
                        {product.category} • {product.size} • {product.resolution}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 mt-6">
                      <div>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={500}
                          height={400}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-3">Technical Specifications</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium">Brightness:</span>
                              <p className="text-muted-foreground">{product.detailedSpecs.brightness}</p>
                            </div>
                            <div>
                              <span className="font-medium">Contrast:</span>
                              <p className="text-muted-foreground">{product.detailedSpecs.contrast}</p>
                            </div>
                            <div>
                              <span className="font-medium">Viewing Angle:</span>
                              <p className="text-muted-foreground">{product.detailedSpecs.viewingAngle}</p>
                            </div>
                            <div>
                              <span className="font-medium">Power:</span>
                              <p className="text-muted-foreground">{product.detailedSpecs.powerConsumption}</p>
                            </div>
                            <div>
                              <span className="font-medium">Operating Temp:</span>
                              <p className="text-muted-foreground">{product.detailedSpecs.operatingTemp}</p>
                            </div>
                            <div>
                              <span className="font-medium">Weight:</span>
                              <p className="text-muted-foreground">{product.detailedSpecs.weight}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-3">Connectivity</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.detailedSpecs.connectivity.map((conn, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {conn}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-3">Applications</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.applications.map((app, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {app}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-3">All Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-3xl font-bold text-foreground">{product.price}</span>
                              <p className="text-sm text-muted-foreground">
                                {product.detailedSpecs.warranty} warranty included
                              </p>
                            </div>
                            <Button disabled={!product.inStock} className="flex items-center space-x-2">
                              <ShoppingCart className="h-4 w-4" />
                              <span>Add to Cart</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No products found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                    setSelectedAspectRatio("All")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-16">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
