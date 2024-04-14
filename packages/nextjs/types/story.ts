export interface GeneratedStory {
  title: string;
  subtitle: string;
  chapters: {
    chapter: number;
    content: string;
  }[];
}

export interface StoryData {
  generatedStory: GeneratedStory;
  image: string;
  submittedStory: string;
  timestamp: string;
  imagePrompt: string;
}
