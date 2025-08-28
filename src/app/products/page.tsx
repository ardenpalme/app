import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Camera,
  Radar,
  Bluetooth,
  Eye,
  Users,
  BarChart3,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/_components/main_navbar"
import Footer from "@/app/_components/main_footer"

export default function Products() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section - Full Width */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="px-4 md:px-6 text-center max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Advance Sensor Solution for Real-Time
            <p className="text-blue-600"> Retail and DOOH Intelligence</p>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Deploy AI-powered sensor systems that track real-time audience engagement, 
            shopper demographics, and store conversions—connecting DOOH exposure to in-mall retail performance.
          </p>
        </div>
      </section>

      {/* R&D Banner */}
      <section className="w-full py-3 bg-amber-50 border-y border-amber-200">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-4 text-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shrink-0"></div>
            <p className="text-lg font-medium text-amber-800">
              Our products are currently in active R&D phase - Stay tuned for breakthrough innovations
            </p>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shrink-0"></div>
          </div>
        </div>
      </section>

      {/* Unified Sensor Section */}
      <section className="w-full py-20 bg-white">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Unified Sensor Suite</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All our products are built on the same advanced sensor technology platform, optimized for different retail
              environments and use cases.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-3xl mb-4">Edge-AI Sensor Platform</CardTitle>
                <CardDescription className="text-lg">
                  Multi-modal sensing combining computer vision, stereo depth, radar, and BLE tracking 
                  to understand shopper behavior in retail environments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="inline-block p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg items-center justify-center">
                  <Image
                    src="/unified-sensor-node.png"
                    alt="Unified Sensor Suite Technology"
                    width={800}
                    height={350}
                    className="rounded-lg"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI Demographics Camera</h3>
                    <p className="text-gray-600 text-sm">
                      Real-time computer vision for age, gender, emotion detection, and gaze tracking with
                      privacy-preserving processing
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Radar className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">4D mmWave Radar</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced radar sensing for gait analysis, movement patterns, and precise occupancy detection in
                      all lighting conditions
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bluetooth className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bluetooth/MAC Sniffer</h3>
                    <p className="text-gray-600 text-sm">
                      Anonymous device tracking for customer journey mapping, return visitor identification, and dwell
                      time analysis
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Capabilities</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Real-time demographic profiling</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Movement pattern analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Occupancy and traffic counting</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Dwell time measurement</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Anonymous visitor tracking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Attention and engagement metrics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Privacy-compliant data processing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Edge-AI real-time inference</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Applications */}
      <section className="w-full py-20 bg-gray-50">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Applications</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our unified sensor suite is configured and optimized for specific retail environments and use cases.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* POS Analytics Application */}
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-8">
	        <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">POS Analytics Sensor</CardTitle>
		</div>
                <CardDescription className="text-lg">
                  Sensor suite optimized for point-of-sale environments with queue management and checkout analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                    <Image
                      src="/pos_checkout.jpg"
                      alt="DOOH Analytics Configuration"
                      width={900}
                      height={900}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Optimized Applications</h3>
                  <ul className="space-y-6 text-gray-600">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">DOOH-to-Purchase Attribution</span>
                        <p className="text-sm text-gray-500">
                          Identify whether a customer at checkout previously engaged with a 
                          DOOH ad—closing the loop between ad exposure and in-store conversion.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Demographic Insights at Point of Sale</span>
                        <p className="text-sm text-gray-500">
                          Capture anonymized age, gender, and race data for paying customers to 
                          validate campaign reach and purchasing behavior by audience segment.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Traffic-Aware Retail Optimization</span>
                        <p className="text-sm text-gray-500">
                          Data-driven insights for optimal staffing based on traffic patterns and peak hours
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Queue Length Optimization</span>
                        <p className="text-sm text-gray-500">
                          Real-time monitoring of checkout lines to reduce wait times and improve customer satisfaction
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

              </CardContent>
            </Card>

            {/* DOOH Analytics Application */}
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-8">
	        <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">DOOH Analytics Sensor</CardTitle>
		</div>
                <CardDescription className="text-lg">
                  Sensor suite optimized for digital advertising displays with audience measurement and engagement
                  tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                    <Image
                      src="/dooh_analytics.jpg"
                      alt="DOOH Analytics Configuration"
                      width={430}
                      height={430}
                      className="w-full h-auto max-w-[800px] rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900">Optimized Applications</h3>
                  <ul className="space-y-5 text-gray-600">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Real-Time Audience Measurement</span>
                        <p className="text-sm text-gray-500">
                          Accurate counting and demographic analysis of viewers for verified advertising metrics
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Gaze Tracking & Engagement</span>
                        <p className="text-sm text-gray-500">
                          Measure attention levels and engagement duration for ad content optimization
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Dynamic Content Optimization</span>
                        <p className="text-sm text-gray-500">
                          Automatically adjust advertising content based on real-time audience demographics
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Impression Verification</span>
                        <p className="text-sm text-gray-500">
                          Provide advertisers with verified, auditable metrics for campaign performance
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Revenue Optimization</span>
                        <p className="text-sm text-gray-500">
                          Maximize advertising revenue through data-driven pricing and placement strategies
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="w-full py-20 bg-white">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technical Excellence</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technology for reliable, accurate, and privacy-compliant analytics
            </p>
          </div>


          <div className="grid md:grid-cols-3 gap-8">

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-grow space-y-3 md:space-y-0">
                <CardTitle className="md:py-2">Edge-AI Processing</CardTitle>
                <CardDescription>
                  On-device AI processing ensures real-time analytics with minimal latency and maximum privacy
                  protection
                </CardDescription>
            </div>
          </CardHeader>
	  </Card>

            <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
            <div className="flex-grow space-y-3 md:space-y-0">
                <CardTitle className="md:py-2">Privacy Compliant</CardTitle>
                <CardDescription>
                  GDPR and CCPA compliant with anonymous data processing and no personal information storage
                </CardDescription>
		</div>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4 md:flex-col md:space-x-0 md:items-start">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 md:mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
            <div className="flex-grow space-y-3 md:space-y-0">
                <CardTitle className="md:py-2">Scalable Deployment</CardTitle>
                <CardDescription>
                  Easy installation and centralized management for single locations or enterprise-wide deployments
                </CardDescription>
	</div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="w-full py-20 bg-blue-600">
        <div className="px-4 md:px-6 text-center max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Maximize Media Revenue with DOOH and Retail Intelligence</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our AI-powered sensor nodes provide privacy-preserving real-time shopper insights to you and your store tenants.
          </p>
          <div className="flex justify-center">
            <Link href="mailto:contact@intuitus-ads.com">
              <Button size="lg" variant="secondary" className="cursor-pointer">
                Schedule a Demo
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
  );
}
