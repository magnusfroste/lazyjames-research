import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { getExportFormat, setExportFormat, ExportFormat, getResearchDisplayStyle, setResearchDisplayStyle, ResearchDisplayStyle } from "@/lib/exportUtils";

export default function SettingsPage() {
  const [exportFormat, setCurrentExportFormat] = useState<ExportFormat>("pdf");
  const [researchDisplayStyle, setCurrentResearchDisplayStyle] = useState<ResearchDisplayStyle>("compact");

  useEffect(() => {
    setCurrentExportFormat(getExportFormat());
    setCurrentResearchDisplayStyle(getResearchDisplayStyle());
  }, []);

  const handleExportFormatChange = (format: ExportFormat) => {
    setCurrentExportFormat(format);
    setExportFormat(format);
  };

  const handleResearchDisplayStyleChange = (style: ResearchDisplayStyle) => {
    setCurrentResearchDisplayStyle(style);
    setResearchDisplayStyle(style);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and configuration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">
                Select your preferred theme
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>
            Configure default export format for research data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Default Export Format</Label>
            <RadioGroup 
              value={exportFormat} 
              onValueChange={handleExportFormatChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="text-sm">
                  PDF - Professional formatted document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="text-sm">
                  JSON - Raw data for integrations
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Display Style</CardTitle>
          <CardDescription>
            Choose how research analysis content is displayed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Display Style</Label>
            <RadioGroup 
              value={researchDisplayStyle} 
              onValueChange={handleResearchDisplayStyleChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="compact" />
                <Label htmlFor="compact" className="text-sm">
                  Compact - Collapsed accordion sections
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="detailed" />
                <Label htmlFor="detailed" className="text-sm">
                  Detailed - Expanded accordion sections
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spacious" id="spacious" />
                <Label htmlFor="spacious" className="text-sm">
                  Spacious - Individual cards for each section
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}