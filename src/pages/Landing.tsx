import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Activity, Video, Calendar, FileText, Shield, Users } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Video,
            title: "Teleconsultation",
            description: "Connect with healthcare professionals through secure video calls",
        },
        {
            icon: Calendar,
            title: "Easy Scheduling",
            description: "Book appointments at your convenience with instant confirmation",
        },
        {
            icon: FileText,
            title: "Medical Records",
            description: "Access your complete medical history anytime, anywhere",
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your health data is protected with enterprise-grade security",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-30 border-b bg-white/70 dark:bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center shadow">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold">HealthConnect</span>
                    </div>
                    <Button onClick={() => navigate("/select-user-type")} size="lg">
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                        Modern Healthcare
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500">
                            At Your Fingertips
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300">
                        Connect with qualified healthcare professionals, manage appointments, and access your medical records all in one secure platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Button size="lg" onClick={() => navigate("/login?type=patient")} className="gap-2">
                            <Users className="w-5 h-5" />
                            Patient Portal
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/login?type=doctor")} className="gap-2">
                            <Activity className="w-5 h-5" />
                            Doctor Portal
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Why Choose HealthConnect?</h2>
                    <p className="text-slate-600 dark:text-slate-300">Experience healthcare that adapts to your lifestyle</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl border bg-white/70 dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-sky-500">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="rounded-3xl p-12 text-center text-white bg-gradient-to-br from-indigo-600 to-sky-500 shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-lg mb-8/ opacity-90">
                        Join thousands of patients and healthcare providers using HealthConnect
                    </p>
                    <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>Create Your Account</Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-white/70 dark:bg-slate-900/60 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} HealthConnect. Your trusted telemedicine platform.</p>
                </div>
            </footer>
        </div>
    );
}
