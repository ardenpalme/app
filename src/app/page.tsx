'use client';
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Presentation, Store, LayoutDashboard, ArrowRight, Check, BarChart3, Eye, MapPin, TrendingUp, Users, Shield, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import Navbar from "@/app/_components/main_navbar"
import Footer from "@/app/_components/main_footer"

export default function () {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full py-20 md:py-32">
        <div className="px-4 md:px-6 mx-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                Smart End-to-End DOOH Advertising Solution
                <span className="text-blue-600"> Advanced Analytics</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect DOOH impressions to actual in-store conversions.
                Showcase the commercial impact of your media network on in-mall retail success. 
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="mailto:contact@intuitus-ads.com">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    Request Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-900 border-2 border-blue-500 hover:bg-blue-50 cursor-pointer"
                  >
                  Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500" />
                <span>30-day pilot program</span>
                <span>•</span>
                <span>ROI guarantee or money-back</span>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 flex items-center justify-center">
                <Image
                  src="/mall_dooh.jpg"
                  alt="LaunchPad AI Sensor System - Advanced IoT sensors with cameras, radar, and edge-AI processing for retail analytics"
                  width={800}
                  height={500}
                  className="rounded-xl"
                  priority
                />
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Real-Time Analytics</div>
                    <div className="text-xs text-gray-500">Edge-AI Processing</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Privacy Compliant</div>
                    <div className="text-xs text-gray-500">GDPR & CCPA</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">+24% ROI*</div>
                    <div className="text-xs text-gray-500">Proj. Increase</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 mx-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
              <CardTitle className="md:py-2">Real-Time Audience Measurement</CardTitle>
              <CardDescription>
                Track impressions, dwell time, and audience demographics in real-time across all your digital displays.
                Provide advertisers with verified impression data and gaze-based engagement metrics.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
              <CardTitle className="md:py-2">Privacy-Safe Data Processing </CardTitle>
              <CardDescription>
                Sensors collect anonymously shoppers ID's, which are periodically deleted. 
                Our privacy-conscious system architecture is designed for on-premise data processing.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
              <CardTitle className="md:py-2">POS Customer Analytics</CardTitle>
              <CardDescription>
                Provide store tenants with real-time customer intelligence. Who is buying (demographics)? Did they see the DOOH ad?
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
              <CardTitle className="md:py-2">Demographic Insights</CardTitle>
              <CardDescription>
                Provide store tenants with key DOOH viewer demographics statistics. 
                Enable them to tailor their messaging messaging to resonate with
                specific groups, improving ad performance.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <LayoutDashboard className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
              <CardTitle className="md:py-2">Centralized Dashboard</CardTitle>
              <CardDescription>
                Store tenants and mall operators access all your real-time data and analytics in one intuitive dashboard. 
                Monitor DOOH network performance, track customer demographics, and generate reports.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <Presentation className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
              <CardTitle className="md:py-2">Automated Reporting</CardTitle>
              <CardDescription>
                Generate custom reports automatically and share them with stakeholders. Keep everyone informed about
                performance and progress.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 bg-white">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Turn Measured Attention into Higher Ad Rates and Tenant Value
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Increase DOOH Ad Revenue by 10–25%*</h3>
                    <p className="text-gray-600">
                      Implement data-backed premium pricing and zone-based CPM optimization using 
                      verified impressions, dwell time, and demographic targeting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Attract Premium Advertisers</h3>
                    <p className="text-gray-600">
                      Verified audience metrics and demographic insights help you secure long-term contracts with
                      high-value brands.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Close the Loop Between Ad Exposure and In-Store Sales</h3>
                    <p className="text-gray-600">
                      Track customer journeys from screen to checkout and deliver anonymized demographic reports to store tenants.
                      Measure ROI from DOOH ad spend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center order-first lg:order-last">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Dashboard</h3>
              <p className="text-gray-600">
                <text className="font-semibold">Mall Owners</text>: Monitor all your mall's digital advertising performance.
              </p>
              <p className="text-gray-600 mb-6">
                <text className="font-semibold">Store Tenants</text>: Monitor POS Customer Analytics, DOOH ad attributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="w-full py-20 bg-blue-600">
        <div className="px-4 md:px-6 text-center max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Maximize Ad Revenue While Supporting Tenant Success
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Offer proof of performance that keeps advertisers and retailers invested.
          </p>
          <div className="flex justify-center">
            <Link href="mailto:contact@intuitus-ads.com">
              <Button size="lg" variant="secondary" className="cursor-pointer">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
  )
}

