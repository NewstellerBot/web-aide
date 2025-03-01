"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    image: "/placeholder.svg",
    content:
      "Aide has transformed how we build AI workflows. The no-code interface makes it accessible to our entire team.",
  },
  {
    name: "Michael Chen",
    role: "Developer",
    company: "InnovateLabs",
    image: "/placeholder.svg",
    content:
      "As a developer, I appreciate the flexibility and power of Aide. It's perfect for both simple and complex workflows.",
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "DataCo",
    image: "/placeholder.svg",
    content:
      "The pre-built templates and intuitive interface have significantly reduced our development time.",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  };

  const previous = () => {
    setCurrentIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4 md:px-12">
              <Card className="mx-auto max-w-sm p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      {Array(5).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      {testimonial.content}
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={previous}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  );
}
