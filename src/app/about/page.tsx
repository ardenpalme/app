"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/app/_components/main_navbar"
import Footer from "@/app/_components/main_footer"
import { MapPin } from "lucide-react"

export default function () {
  return (
    <div className="flex flex-col min-h-screen items-center overflow-x-hidden">
      <Navbar />

      <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 my-10">
        <CardHeader className="text-center space-y-2 pb-4">
          <h2 className="text-2xl font-bold text-foreground">About Us</h2>
          <p className="text-sm text-muted-foreground font-medium"> Goal: Effective digital signage advertising </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-6">
            {/* Address Section */}
            <div className="flex flex-col  space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <MapPin className="h-4 w-4" />
                <span>Our Location</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>30 North Gould Street</p>
                <p>Sheridan, WY 82801</p>
                <p>United States</p>
                <p>contact@intuitus-ads.com</p>
                <p>(307) 207-5967</p>
              </div>
            </div>

            {/* Separator */}
            <div className="w-px bg-border"></div>

            {/* Main Content */}
            <div className="flex-1">
              <p className="text-muted-foreground leading-relaxed">
                We help other businesses create best digital signage ads that convert. 
              </p>
                <br/>
              <p className="text-muted-foreground leading-relaxed">
                We help property owners monetize their public spaces with smart digital signage. 
              </p>
                <br/>
              <p className="text-muted-foreground leading-relaxed">
                In R&D, we use robust and scalable desing principles, maintaining a high quality standard, while adhering to strict data privacy standards.
              </p>
                <br/>
              <div className="flex justify-center">
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-16">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
