'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateCodeFromPrompt } from '@/ai/flows/generate-code-from-prompt';
import { explainCodeSnippet } from '@/ai/flows/explain-code-snippet';
import { suggestImprovements } from '@/ai/flows/suggest-improvements';
import { DEFAULT_CODE_SNIPPET, LANGUAGES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

type LoadingStates = {
  generate: boolean;
  explain: boolean;
  improve: boolean;
};

type CopilotContextType = {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  explanation: string;
  improvements: string[];
  generatedCode: string;
  isLoading: LoadingStates;
  handleGenerate: (prompt: string) => Promise<void>;
  handleExplain: () => Promise<void>;
  handleImprove: () => Promise<void>;
  insertGeneratedCode: () => void;
};

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const CopilotProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState<string>(DEFAULT_CODE_SNIPPET);
  const [language, setLanguage] = useState<string>(LANGUAGES[0].value);
  const [explanation, setExplanation] = useState<string>('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<LoadingStates>({
    generate: false,
    explain: false,
    improve: false,
  });
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    setIsLoading(prev => ({ ...prev, generate: true }));
    setGeneratedCode('');
    try {
      const result = await generateCodeFromPrompt({ prompt, language });
      setGeneratedCode(result.code);
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error Generating Code',
        description: 'Could not generate code from the prompt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, generate: false }));
    }
  };

  const handleExplain = async () => {
    setIsLoading(prev => ({ ...prev, explain: true }));
    setExplanation('');
    try {
      const result = await explainCodeSnippet({ codeSnippet: code, language });
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error explaining code:', error);
      toast({
        title: 'Error Explaining Code',
        description: 'Could not explain the code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, explain: false }));
    }
  };

  const handleImprove = async () => {
    setIsLoading(prev => ({ ...prev, improve: true }));
    setImprovements([]);
    try {
      const result = await suggestImprovements({ code, language });
      setImprovements(result.improvements);
    } catch (error) {
      console.error('Error suggesting improvements:', error);
       toast({
        title: 'Error Suggesting Improvements',
        description: 'Could not suggest improvements. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, improve: false }));
    }
  };

  const insertGeneratedCode = () => {
    if (generatedCode) {
      setCode(prevCode => prevCode + '\n\n' + generatedCode);
      toast({
        title: 'Code Inserted',
        description: 'Generated code has been added to the editor.',
      });
    }
  };

  return (
    <CopilotContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        explanation,
        improvements,
        generatedCode,
        isLoading,
        handleGenerate,
        handleExplain,
        handleImprove,
        insertGeneratedCode,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export const useCopilot = (): CopilotContextType => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};
