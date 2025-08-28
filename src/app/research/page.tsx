import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText, Users, Radar, Shield, Zap, BookOpen, Award, Rocket, Brain, Database } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/app/_components/main_navbar"
import Footer from "@/app/_components/main_footer"

export default function ResearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="px-4 md:px-6 text-center max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Pioneering the Future of
              <span className="text-blue-600"> DOOH & Retail Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our team is developing sensor systems that unify audience analytics, shopper behavior tracking, and privacy-preserving attribution. 
              We consistently consider and address challenges of deploying and maintaining this system in physical retail environments and DOOH networks.
            </p>
          </div>
        </div>
      </section>

      {/* R&D Status Banner */}
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

      {/* Research Overview */}
      <section className="w-full py-20 bg-white">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Research Focus Areas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our interdisciplinary research spans computer vision, radar signal processing, privacy-preserving AI, and
              edge computing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Radar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>mmWave Radar Technology</CardTitle>
                <CardDescription>
                  Advanced signal processing and machine learning techniques for high-resolution gait analysis and
                  movement detection using commercial mmWave radar systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Privacy-Preserving Analytics</CardTitle>
                <CardDescription>
                  Developing novel approaches to extract valuable insights while maintaining strict privacy compliance
                  and anonymous data processing standards.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Edge-AI Processing</CardTitle>
                <CardDescription>
                  Optimizing deep learning models for real-time inference on edge devices with minimal power consumption
                  and maximum accuracy.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="w-full py-20 bg-gray-50">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Foundational Research</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key academic research papers that form the foundation of our current R&D efforts and product development
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Paper 1 */}
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3">
                      Research Paper
                    </Badge>
                    <CardTitle className="text-xl mb-2">
                      MmGait-3D: Large-Scale 3D Gait Dataset with mmWave Radar and Depth Camera
                    </CardTitle>
                    <CardDescription className="text-base">
                      This foundational research provides the dataset and methodology framework that our team is
                      leveraging to develop advanced 3D gait analysis capabilities for retail environments.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">

                  <div className="flex justify-center items-center">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                      <Image
                        src="/diagram.png"
                        alt="MmGait-3D Research Visualization"
                        width={350}
                        height={200}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Key Contributions</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>First large-scale dataset combining mmWave radar and depth camera for gait analysis</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Novel multi-modal fusion techniques for improved gait recognition accuracy</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Comprehensive evaluation framework for 3D gait analysis systems</span>
                      </li>
                      <li>
                        <div className="flex w-[50px] p-1">
                          <Link href="https://arxiv.org/abs/2503.07435" target="_blank" rel="noopener noreferrer" >
                            <Button variant="outline" className="flex-1 cursor-pointer">
                              Learn More
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Biometric Identification</Badge>
                  <Badge variant="outline">Healthcare Monitoring</Badge>
                  <Badge variant="outline">Security Systems</Badge>
                  <Badge variant="outline">Retail Analytics</Badge>
                </div>

              </CardContent>
            </Card>

            {/* Paper 2 */}
            <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3">
                      Research Paper
                    </Badge>
                    <CardTitle className="text-xl mb-2">
                      Privacy-Preserving Gait Analysis Using Commercial mmWave Radar
                    </CardTitle>
                    <CardDescription className="text-base">
                      This pioneering work in privacy-preserving radar analytics serves as the foundation for our
                      privacy-by-design approach in developing commercial retail intelligence solutions.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="flex justify-center items-center">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                      <Image
                        src="/radar_board.png"
                        alt="Privacy-Preserving Gait Analysis Research"
                        width={325}
                        height={200}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Key Contributions</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Privacy-by-design framework for radar-based gait analysis systems</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Anonymous feature extraction techniques maintaining analytical accuracy</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>GDPR and CCPA compliance validation for commercial deployments</span>
                      </li>
                      <li>
                        <div className="flex w-[50px] p-1">
                          <Link href="https://www.mdpi.com/1424-8220/24/1/142" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="flex-1 cursor-pointer">
                              Learn More
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Retail Analytics</Badge>
                  <Badge variant="outline">Smart Buildings</Badge>
                  <Badge variant="outline">Public Spaces</Badge>
                  <Badge variant="outline">Healthcare</Badge>
                </div>

              </CardContent>
            </Card>

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

