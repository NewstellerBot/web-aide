"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, Zap, Users, ChevronRight } from "lucide-react";
import { Testimonials } from "@/components/landing/testimonials";
import { cn } from "@/lib/utils";
import Image from "next/image";
import FlowAnimation from "@/components/landing/workflow-animation";
import { useClerk } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Logo = () => (
  <Image
    alt=""
    src={"/logo.svg"}
    width={24}
    height={24}
    className="invert filter"
  />
);

export default function Page() {
  const { openSignIn, openSignUp, user } = useClerk();
  const [hasScrolled, setHasScrolled] = useState(false);

  if (!!user) redirect("/app");

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          "bg-gradient-to-r from-pink-500/5 via-blue-500/5 to-purple-500/5",
          "backdrop-blur supports-[backdrop-filter]:bg-background/60",
          hasScrolled && "border-b",
        )}
      >
        <div className="container ml-auto mr-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold">aide</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium hover:text-primary"
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => openSignIn()}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => openSignUp()}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5">
        {/* Hero Section */}
        <section className="container px-8 py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-fit transform-gpu bg-white/5 filter backdrop-blur-md"
                >
                  No-Code AI Platform
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Build AI Workflows Without Writing Code
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create powerful AI workflows with our intuitive drag-and-drop
                  editor. No coding required.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="w-fit"
                  onClick={() => openSignUp()}
                >
                  Try It Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="w-fit">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="rounded-lg border bg-background p-8">
              <FlowAnimation />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container space-y-12 px-4 py-12 md:py-24 lg:py-32"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="outline">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need to Build AI Workflows
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our intuitive platform makes it easy to create complex AI
              workflows in minutes.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card className="p-6">
              <Zap className="mb-4 h-12 w-12" />
              <h3 className="font-bold">Drag & Drop Editor</h3>
              <p className="text-sm text-muted-foreground">
                Create workflows by dragging and connecting nodes on our
                intuitive canvas.
              </p>
            </Card>
            <Card className="p-6">
              <Code2 className="mb-4 h-12 w-12" />
              <h3 className="font-bold">Pre-built Templates</h3>
              <p className="text-sm text-muted-foreground">
                Start quickly with our library of pre-built workflow templates.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="mb-4 h-12 w-12" />
              <h3 className="font-bold">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Work together with your team to build and improve workflows.
              </p>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="container space-y-12 px-4 py-12 md:py-24 lg:py-32"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="outline">Benefits</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Built for Everyone
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Whether you&apos;re a developer or business user, our platform
              helps you build AI workflows faster.
            </p>
          </div>
          <div className="mx-auto grid max-w-lg gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">For Business Users</h3>
              <ul className="space-y-2">
                {[
                  "No coding required",
                  "Intuitive visual interface",
                  "Pre-built templates",
                  "Quick deployment",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">For Developers</h3>
              <ul className="space-y-2">
                {[
                  "API integration",
                  "Custom node creation",
                  "Version control",
                  "Advanced debugging",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="container space-y-12 px-4 py-12 md:py-24 lg:py-32"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="outline">Testimonials</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Loved by Teams Worldwide
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers are saying about building AI workflows with
              our platform.
            </p>
          </div>
          <Testimonials />
          {/* // cardClassName="bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5" /> */}
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of teams building AI workflows with our platform.
            </p>
            <Button size="lg" className="mt-4" onClick={() => openSignUp()}>
              Start Building for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container ml-auto mr-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold">aide</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for the AI community.{" "}
            <Link href="#" className="font-medium underline underline-offset-4">
              Terms
            </Link>
            .{" "}
            <Link href="#" className="font-medium underline underline-offset-4">
              Privacy
            </Link>
            .
          </p>
        </div>
      </footer>
    </>
  );
}
