import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MessageCircle, ExternalLink, Heart } from "lucide-react";

interface Resource {
  title: string;
  description: string;
  urgent: boolean;
}

interface CrisisResourcesProps {
  resources: Resource[];
  crisisIndicators: string[];
}

const CrisisResources = ({ resources, crisisIndicators }: CrisisResourcesProps) => {
  const hasUrgentResources = resources.some(r => r.urgent);
  const emergencyResources = [
    {
      title: "Crisis Text Line",
      description: "Text HOME to 741741 - Free, 24/7 crisis support",
      action: "Text Now",
      icon: MessageCircle,
      urgent: true
    },
    {
      title: "National Suicide Prevention Lifeline",
      description: "Call 988 - Free and confidential support",
      action: "Call Now",
      icon: Phone,
      urgent: true
    },
    {
      title: "Emergency Services",
      description: "If you're in immediate danger",
      action: "Call 911",
      icon: AlertTriangle,
      urgent: true
    }
  ];

  if (!hasUrgentResources && crisisIndicators.length === 0) {
    return null;
  }

  const handleResourceClick = (title: string) => {
    // In a real app, this could open the appropriate service
    if (title.includes("Crisis Text Line")) {
      window.open("https://www.crisistextline.org/", "_blank");
    } else if (title.includes("Suicide Prevention")) {
      window.open("https://suicidepreventionlifeline.org/", "_blank");
    } else if (title.includes("Emergency")) {
      // For demo purposes, show alert
      alert("In a real emergency, please call 911 immediately.");
    }
  };

  return (
    <Card className="p-4 border-red-200 bg-red-50">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Support Resources Available</h3>
        </div>

        {crisisIndicators.length > 0 && (
          <div className="p-3 bg-red-100 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 font-medium mb-2">
              I notice some concerning patterns in our conversation:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {crisisIndicators.map((indicator, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white p-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-red-600" />
            <p className="text-sm font-medium text-red-800">
              You're not alone. Help is available right now:
            </p>
          </div>

          <div className="space-y-3">
            {emergencyResources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <resource.icon className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800 text-sm">{resource.title}</p>
                    <p className="text-xs text-red-600">{resource.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleResourceClick(resource.title)}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {resource.action}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {resources.filter(r => !r.urgent).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-red-800">Additional Support:</p>
            {resources.filter(r => !r.urgent).map((resource, index) => (
              <div key={index} className="p-2 bg-white rounded border border-red-200">
                <p className="font-medium text-sm text-red-800">{resource.title}</p>
                <p className="text-xs text-red-600">{resource.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-red-700">
            Remember: This AI is a support tool, not a replacement for professional help.
            If you're in crisis, please reach out to these resources immediately.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CrisisResources;