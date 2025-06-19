import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqItems = [
  {
    question: "How does the middleman service work?",
    answer: "Our verified middleman service connects you with trusted community members who facilitate safe trades. Simply request a middleman, wait for assignment, and follow the guided trading process for maximum security."
  },
  {
    question: "How accurate are the item values?",
    answer: "Our values are updated daily based on real market transactions, community trading patterns, and demand analysis. We use advanced algorithms to ensure the most accurate pricing information available."
  },
  {
    question: "Is the platform free to use?", 
    answer: "Yes! All core features including trade ads, item values, middleman service, and community features are completely free. We're committed to supporting the Grow a Garden trading community."
  },
  {
    question: "How do I start trading on the platform?",
    answer: "Simply create an account, connect your Roblox profile, and start browsing available trades. You can create trade advertisements or respond to existing ones from other players."
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <p className="text-gray-300 text-lg">Common questions about our trading platform and services</p>
        </div>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <Card key={index} className="gaming-card overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-purple-900/20 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="text-purple-400" />
                  ) : (
                    <ChevronDown className="text-purple-400" />
                  )}
                </div>
              </div>
              {openItems.includes(index) && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-gray-300">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
