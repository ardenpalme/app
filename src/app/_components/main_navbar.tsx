"use client";

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Menu } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ContactForm } from "./contact-form";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Butterfly_Kids } from "next/font/google";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image src="/logo.svg" alt="Company Logo" width={32} height={32} className="h-9 w-32" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium text-gray-600 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/products" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium text-gray-600 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                Products
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 text-gray-600 hover:text-black focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-row gap-4">
          {/*
            <SignedIn>
              <SignOutButton/>
              <Button size="sm" asChild>
                <div className="flex flex-row">
                  <Link href="/dashboard" target="_blank" rel="noopener noreferrer">Dashboard</Link>
                  <ArrowUpRight/>
                </div>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignInButton />
            </SignedOut>
          */}

          <ContactForm/>
        </div>
      </div>


      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed top-16 left-0 right-0 z-40 border-t bg-white px-4 py-6 shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center space-y-4 text-center">
              <Link href="/about" className="text-gray-700 hover:text-black text-lg">About</Link>
              <Link href="/products" className="text-gray-700 hover:text-black text-lg">Products</Link>
              <Link href="/research" className="text-gray-700 hover:text-black text-lg">Research</Link>
              <Link href="mailto:contact@intuitus-ads.com" className="text-gray-700 hover:text-black text-lg">Contact Us</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


