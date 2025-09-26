import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, Upload, Users, Sparkles, Github, Mail, Phone, FileText, Database, Target, Zap } from "lucide-react"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: string
  ctaText?: string
  ctaHref?: string
  ctaNode?: React.ReactNode
  gridOptions?: {
    angle?: number
    cellSize?: number
    opacity?: number
    lightLineColor?: string
    darkLineColor?: string
  }
  onTitleClick?: () => void 
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  assetSpace: string
  delay?: number
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  )
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, assetSpace, delay = 0 }) => {
  return (
    <div 
      className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/80 via-white/40 to-transparent dark:from-gray-900/80 dark:via-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="h-48 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-colors duration-300">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {assetSpace}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const AnimatedGeminiLogo = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-20" />
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center animate-pulse">
        <Sparkles className="w-8 h-8 text-white animate-bounce" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  )
}

const CRMLandingPage = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "🚀 Next-Gen CRM Platform",
      subtitle = {
        regular: "Transform Your Business with ",
        gradient: "Intelligent Customer Relationship Management",
      },
      ctaNode,
      gridOptions,
      onTitleClick,
      ...props
    },
    ref,
  ) => {
    const features = [
      {
        icon: Upload,
        title: "Smart CSV Import & Parsing",
        description: "Seamlessly upload your customer and order CSV files. Our intelligent parser automatically converts your data into beautifully formatted tables, ready for analysis and action.",
        assetSpace: "Upload & Parsing Demo GIF"
      },
      {
        icon: Users,
        title: "Advanced Customer Segmentation",
        description: "Create sophisticated customer segments using powerful logical operators. Define rules that automatically categorize your customers based on behavior, demographics, and purchase patterns.",
        assetSpace: "Segmentation Rules Demo GIF"
      },
      {
        icon: Sparkles,
        title: "Google Gemini AI Campaigns",
        description: "Leverage the power of Google's Gemini AI to create intelligent, personalized marketing campaigns that adapt and optimize based on customer interactions and preferences.",
        assetSpace: "AI Campaign Demo GIF"
      }
    ]

    return (
      <div className={cn("relative min-h-screen", className)} ref={ref} {...props}>
        {/* Hero Section */}
        <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <section className="relative max-w-full mx-auto z-1">
          <RetroGrid {...gridOptions} />
          <div className="max-w-screen-xl z-10 mx-auto px-4 py-28 gap-12 md:px-8">
            <div className="space-y-8 max-w-4xl leading-0 lg:leading-5 mx-auto text-center">
              <h1 className="text-5xl tracking-tighter font-bold bg-clip-text text-transparent mx-auto md:text-7xl bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] animate-fade-in">
                {subtitle.regular}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200">
                  {subtitle.gradient}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Empower your business with cutting-edge CRM technology. Upload data, segment customers, and launch AI-powered campaigns—all in one unified platform.
              </p>
              
              <button 
                onClick={onTitleClick}
                className="text-sm text-gray-600 dark:text-gray-400 group font-medium mx-auto px-6 py-3 bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[2px] border-black/5 dark:border-white/5 rounded-full w-fit cursor-pointer hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-gray-400/30 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-gray-400/10 transition-all duration-300 hover:scale-105"
              >
                {title}
                <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
              </button>

              <div className="mt-8 flex justify-center">
                {ctaNode}
              </div>
            </div>
          </div>
        </section>

        {/* What is CRM Section */}
        <section className="relative py-20 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent dark:via-purple-900/10" />
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
                What is a CRM?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Customer Relationship Management (CRM) is your business's command center for managing interactions with customers and prospects. 
                Our platform transforms how you understand, engage, and grow your customer relationships through data-driven insights and AI-powered automation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50">
                <Database className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Data Management</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">Centralize customer data, interactions, and insights in one secure platform</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700/50">
                <Target className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">Smart Targeting</h3>
                <p className="text-green-700 dark:text-green-300 text-sm">Segment customers and create targeted campaigns that convert</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50">
                <Zap className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">Automation</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm">Automate workflows and campaigns with AI-powered intelligence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-4 md:px-8">
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need to transform your customer relationships and drive business growth
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  assetSpace={feature.assetSpace}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>
        </section>

        

        {/* Footer Section */}
        <section className="relative py-20 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-gray-50/30 to-transparent dark:from-slate-900 dark:via-gray-900/30" />
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Developed by
              </h3>
              <h2 className="text-4xl font-bold mb-12 text-gray-900 dark:text-gray-100">
                Priyanshu Pandey
              </h2>
              
              {/* Social Links */}
              <div className="flex justify-center items-center space-x-8 mb-16">
                <a
                  href="https://github.com/PriyanshuPandey92/Xeno-CRM-FrontEnd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                  title="GitHub Repository"
                >
                  <Github className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                </a>
                
                <a
                  href="mailto:priyanshupandey92@gmail.com"
                  className="group p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                  title="Email: priyanshupandey92@gmail.com"
                >
                  <Mail className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                </a>
                
                <a
                  href="tel:+919319345934"
                  className="group p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                  title="Phone: +91 9319345934"
                >
                  <Phone className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                </a>
              </div>
              
              {/* Contribution Message */}
              <div className="max-w-2xl mx-auto mb-16">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Interested in contributing to this project? I'm always open to collaboration and new ideas. 
                  Feel free to reach out via email or check out the repository on GitHub.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-8 px-4 md:px-8 border-t border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50" />
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 CRM. Built with React, TypeScript, and passion for great software.
              </p>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes grid {
            0% { transform: translateY(0); }
            100% { transform: translateY(var(--cell-size)); }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-grid {
            animation: grid 15s linear infinite;
          }
        `}</style>
      </div>
    )
  },
)

CRMLandingPage.displayName = "CRMLandingPage"

export { CRMLandingPage as HeroSection }