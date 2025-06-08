
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface LyricsValidatorProps {
  lyricsData: LyricsData;
  onValidationChange: (isValid: boolean) => void;
}

class LyricsValidator {
  validate(lyricsData: LyricsData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for empty content
    if (lyricsData.order.length === 0) {
      errors.push("No sections found. Add at least one verse or chorus.");
    }

    // Check for empty sections
    lyricsData.order.forEach((sectionId) => {
      let sectionData: LyricsLine[] = [];
      
      if (sectionId.startsWith('verse')) {
        const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
        sectionData = lyricsData.verses[verseIndex] || [];
      } else if (sectionId.startsWith('chorus')) {
        const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
        sectionData = lyricsData.choruses[chorusIndex] || [];
      }

      if (sectionData.length === 0) {
        errors.push(`Empty section: ${sectionId}`);
      }

      // Check for empty lines
      sectionData.forEach((line, lineIndex) => {
        if (!line.text.trim()) {
          warnings.push(`Empty line in ${sectionId} at position ${lineIndex + 1}`);
        }
      });
    });

    // Check verse count
    if (lyricsData.verses.length === 0) {
      warnings.push("No verses found. Most hymns have at least one verse.");
    }

    // Check for consistent verse length
    if (lyricsData.verses.length > 1) {
      const verseLengths = lyricsData.verses.map(verse => verse.length);
      const firstLength = verseLengths[0];
      const hasInconsistentLength = verseLengths.some(length => 
        Math.abs(length - firstLength) > 1
      );
      
      if (hasInconsistentLength) {
        warnings.push("Verses have inconsistent line counts. This may affect singability.");
      }
    }

    // Check for very long lines
    lyricsData.verses.concat(lyricsData.choruses).forEach((section, sectionIndex) => {
      section.forEach((line, lineIndex) => {
        if (line.text.length > 100) {
          suggestions.push(`Consider breaking down long line in section ${sectionIndex + 1}, line ${lineIndex + 1}`);
        }
      });
    });

    // Check for repetitive structure
    if (lyricsData.choruses.length > 1) {
      suggestions.push("Multiple choruses detected. Consider if they should be combined.");
    }

    // Check syllable distribution
    const allLines = lyricsData.verses.concat(lyricsData.choruses).flat();
    if (allLines.length > 0) {
      const syllableCounts = allLines.map(line => line.syllables.length);
      const avgSyllables = syllableCounts.reduce((a, b) => a + b, 0) / syllableCounts.length;
      const maxSyllables = Math.max(...syllableCounts);
      const minSyllables = Math.min(...syllableCounts);
      
      if (maxSyllables - minSyllables > 10) {
        suggestions.push(`Large variation in syllable count (${minSyllables}-${maxSyllables}). Consider balancing line lengths.`);
      }
    }

    // Check for special characters or formatting
    allLines.forEach((line, index) => {
      if (line.text.includes('[') || line.text.includes(']')) {
        warnings.push(`Bracket characters found in line ${index + 1}. These may be formatting artifacts.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }
}

const LyricsValidatorComponent = ({ lyricsData, onValidationChange }: LyricsValidatorProps) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  });

  useEffect(() => {
    const validator = new LyricsValidator();
    const result = validator.validate(lyricsData);
    setValidation(result);
    onValidationChange(result.isValid);
  }, [lyricsData, onValidationChange]);

  const getStatusIcon = () => {
    if (validation.errors.length > 0) {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    } else if (validation.warnings.length > 0) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusText = () => {
    if (validation.errors.length > 0) {
      return "Has Errors";
    } else if (validation.warnings.length > 0) {
      return "Has Warnings";
    } else {
      return "Valid";
    }
  };

  const getStatusColor = () => {
    if (validation.errors.length > 0) {
      return "text-red-800";
    } else if (validation.warnings.length > 0) {
      return "text-yellow-800";
    } else {
      return "text-green-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Validation
          <span className={`text-sm font-normal ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {validation.errors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="font-medium text-red-800 mb-2">Errors (Must Fix)</div>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="font-medium text-yellow-800 mb-2">Warnings</div>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.suggestions.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="font-medium text-blue-800 mb-2">Suggestions</div>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.errors.length === 0 && validation.warnings.length === 0 && validation.suggestions.length === 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="font-medium text-green-800">All good!</div>
              <p className="text-green-700 text-sm">Your lyrics are valid and ready to save.</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LyricsValidatorComponent;
export { LyricsValidator };
