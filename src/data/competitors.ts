export type BattlecardData = {
    id: string;
    name: string;
    logoUrl?: string;
    productType: "Express" | "RPOS";
    painPoints: { title: string; description: string }[];
    starters: string[];
    spotonStrengths: { title: string; description: string }[];
    objections: {
        objection: string;
        theirStrength: string;
        counterPoints: string;
    }[];
};

export const competitors: BattlecardData[] = [
    {
        id: "clover-express",
        name: "Clover",
        productType: "Express",
        painPoints: [
            {
                title: "Reliance on Third-Party Apps",
                description:
                    "Clients must search, download, and manage multiple third-party apps and vendors to get the functionality they need, causing inconsistencies and added complexity.",
            },
            {
                title: "Slow Transactions",
                description:
                    "Lacks flexibility and speed due to reliance on external apps that cause compatibility issues and disrupt the user experience.",
            },
            {
                title: "Basic Marketing",
                description:
                    "Clover is a basic DIY tool without automation, integrations, or support for posting to Facebook and Instagram.",
            },
            {
                title: "Unreliable Offline Mode",
                description:
                    "Many POS systems experience high error rates when running in offline mode, leading to lost transactions.",
            }
        ],
        starters: [
            "Have menu efforts ever caused order mistakes or customer complaints?",
            "How important is it for you to speed up transaction times during peak hours?",
            "How many different tech solutions are you currently working with to run your operations? Would consolidating simplify your workflow?",
            "How much time do you spend setting up or managing marketing campaigns?",
        ],
        spotonStrengths: [
            {
                title: "Easily Edit Your Menu",
                description: "Edit menu items in 17 seconds. Express’s intuitive interface helps staff perform tasks faster with minimal training.",
            },
            {
                title: "Fast Transactions",
                description: "21 seconds to enter an order, 20 seconds to checkout. Streamlined orders minimize wait times.",
            },
            {
                title: "Highly Reliable Offline Mode",
                description: ".02% error rate ensures the restaurant stays up and running, even during network outages.",
            },
            {
                title: "Built-in, Cost-Effective Solutions",
                description: "No fee to access all integrations. Eliminate multiple apps built-in commission-free online ordering.",
            },
            {
                title: "Automated Campaigns",
                description: "Marketing Assist generates a full month of marketing and posts directly to Facebook and Instagram without lifting a finger.",
            }
        ],
        objections: [
            {
                theirStrength: "Extensive App Marketplace",
                objection: "We need access to a variety of apps to customize our setup.",
                counterPoints:
                    "SpotOn Express eliminates the need for multiple third-party apps by offering built-in, intuitive solutions at no extra costs.",
            },
            {
                theirStrength: "Advanced Inventory Management",
                objection: "We need a system that helps track stock in real time.",
                counterPoints:
                    "Many restaurants find that POS-based inventory tracking adds unnecessary complexity. SpotOn Express focuses on streamlining order and kitchen operations.",
            },
            {
                theirStrength: "Built-in Reservation System",
                objection: "Do you offer a built-in reservation system?",
                counterPoints:
                    "SpotOn Restaurant POS offers advanced table and reservation management for full-service restaurants, while Express suits fast-paced settings.",
            },
            {
                theirStrength: "Text Marketing & Integrations",
                objection: "We’re considering Clover because of its built-in text marketing and app integrations.",
                counterPoints:
                    "Marketing Assist delivers automated marketing with QR codes and seamless Facebook and Google Business promotions, simplifying customer reach without extra effort.",
            }
        ]
    },
    {
        id: "revel-express",
        name: "Revel",
        productType: "Express",
        painPoints: [
            {
                title: "Consumer-Grade Hardware",
                description: "Relies on consumer-grade iPads, which overheat in hot temperatures and are prone to damage in busy kitchens."
            },
            {
                title: "Slow Navigation for High-Volume",
                description: "While Revel offers easy scrolling, it is not specifically designed for speed and efficiency in high-volume settings."
            }
        ],
        starters: [
            "Do you find that iPads struggle to keep up with the demands of your restaurant?",
            "Have menu efforts ever caused order mistakes or customer complaints?",
            "How important is it for you to speed up transaction times during peak hours?"
        ],
        spotonStrengths: [
            {
                title: "Durable, Purpose-Built Hardware",
                description: "Designed for restaurants, withstanding heat, spills, and heavy use—unlike iPads."
            },
            {
                title: "Fast Transactions",
                description: "21 seconds to enter an order, 20 seconds to checkout."
            },
            {
                title: "Easily Edit Your Menu",
                description: "Edit menu items in 17 seconds thanks to intuitive design."
            }
        ],
        objections: [
            {
                theirStrength: "Advanced inventory management",
                objection: "We need a system that helps us track stock in real time.",
                counterPoints: "While Express focuses on speed, SpotOn RPOS includes deep integrations like R365, BevChek, and Craftable for powerful inventory insights."
            },
            {
                theirStrength: "Smart Forecasting",
                objection: "We need a system that offers forecasting and automated purchase order recommendations.",
                counterPoints: "Through our integrations, we enable better inventory recommendations while leveraging 90+ built-in reports for decision-making."
            }
        ]
    },
    {
        id: "toast-rpos",
        name: "Toast",
        productType: "RPOS",
        painPoints: [
            {
                title: "Rising Costs & Hidden Fees",
                description: "Toast's mass-market approach is failing high-volume operators who complain about subscription costs and additional fees associated with payment processing.",
            },
            {
                title: "Poor Customer Support",
                description: "Many report long wait times for support, unhelpful representatives, and difficulty resolving technical issues. Toast became so big that support is lacking.",
            },
            {
                title: "Disruptive System Updates",
                description: "Frequent updates to the Toast system can be disruptive to operations, requiring staff retraining and causing glitches.",
            },
            {
                title: "Complexity Leading to Inefficiencies",
                description: "Too many features and bells and whistles that aren't needed or used, overcomplicating things.",
            },
            {
                title: "Limited Customization & Integrations",
                description: "Lacks flexibility to adapt to specific workflows. Difficulty connecting Toast with accounting or inventory tools (e.g. Payroll companies refuse to integrate with Toast)."
            }
        ],
        starters: [
            "What gripes do you have about your current POS? What is the biggest issue they are facing?",
            "Let me guess... your rates went up with Toast? Or you suspect they will?",
            "What are your goals for 2025? How are you looking to grow revenue? How is Toast helping you with that?",
            "Ready to explore a solution designed for your needs? Right now, everyone is talking about SpotOn."
        ],
        spotonStrengths: [
            {
                title: "Purpose Built for High-Volume",
                description: "SpotOn is the purpose-built modern POS that speeds up service, delights guests, and delivers better margins."
            },
            {
                title: "24/7 US-Based Support",
                description: "Industry high retention rate backed by an incredibly responsive local support team."
            },
            {
                title: "Transparent & Better Processing Rates",
                description: "We help you secure the best processing rates for your business, completely independent of surprise POS fees."
            }
        ],
        objections: [
            {
                theirStrength: "Lower Upfront Costs (Free Hardware)",
                objection: "Toast offered us free hardware to get started.",
                counterPoints: "Toast's 'free' hardware comes at a steep long-term cost with continuous processing fee hikes and add-on fees. SpotOn is transparent—no surprises or hidden costs."
            },
            {
                theirStrength: "Staff Loves Toast Handhelds",
                objection: "Our staff is used to Toast's handhelds.",
                counterPoints: "Modern bars need modern tools. We put power into sleek devices your staff knows, plus guest-led ordering frees up your team to focus on hospitality."
            },
            {
                theirStrength: "All-in-One Solution",
                objection: "We like that Toast is an all-in-one system.",
                counterPoints: "Being all-in-one shouldn't mean compromising. We integrate with best-in-class solutions like 7Shifts and Restaurant365 for premium tools where it counts."
            },
            {
                theirStrength: "Under Contract",
                objection: "We're currently under a contract with Toast.",
                counterPoints: "You might not be as locked in as you think. Toast rarely enforces contracts because they're overwhelmed. Send me the agreement to review."
            }
        ]
    }
];
