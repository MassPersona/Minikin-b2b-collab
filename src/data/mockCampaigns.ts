import type { Campaign, ModuleOption } from '../types';

export const MOCK_CAMPAIGNS: Campaign[] = [
];

export const MODULE_OPTIONS: ModuleOption[] = [
  {
    id: 'hair-assets',
    label: 'Hair Assets',
    description: 'Select from a library of hairstyle and hair color variations.',
    itemCount: 48,
    sampleAssets: [
      { id: 10139, label: 'Baseball Uniform' },
      { id: 10170, label: 'Leprechaun Headband' },
      { id: 10198, label: 'Courtside Casual' },
      { id: 'hair-010', label: 'Curly Fringe' },
    ],
  },
  {
    id: 'outfit-assets',
    label: 'Outfit Assets',
    description: 'Choose clothing, accessories, and full outfit combinations.',
    itemCount: 124,
    sampleAssets: [
      { id: 2001, label: 'Classic Tuxedo' },
      { id: 2002, label: 'Summer Tee' },
      { id: 2003, label: 'Winter Jacket' },
    ],
  },
  {
    id: 'base-assets',
    label: 'Base Assets',
    description: 'Skin tone, body type, and facial feature base layers.',
    itemCount: 36,
    sampleAssets: [
      { id: 3001, label: 'Fair Skin Base' },
      { id: 3002, label: 'Tan Skin Base' },
      { id: 3003, label: 'Dark Skin Base' },
    ],
  },
  {
    id: 'pose-assets',
    label: 'Pose Assets',
    description: 'Dynamic and static pose sets for varied campaign compositions.',
    itemCount: 62,
    sampleAssets: [
      { id: 4001, label: 'Standing Relaxed' },
      { id: 4002, label: 'Arms Crossed' },
      { id: 4003, label: 'Jump Pose' },
    ],
  },
  {
    id: 'face-accessories',
    label: 'Face Accessories',
    description: 'Glasses, hats, headbands and small accessories.',
    itemCount: 48,
    sampleAssets: [
      { id: 10170, label: 'Leprechaun Headband' },
      { id: 10200, label: 'Retro Shades' },
    ],
  },
  {
    id: 'piercings',
    label: 'Piercings',
    description: 'Ear, nose and facial piercings.',
    itemCount: 20,
    sampleAssets: [
      { id: 11001, label: 'Left Ear Stud' },
      { id: 11002, label: 'Nose Ring' },
    ],
  },
  {
    id: 'makeup',
    label: 'Makeup',
    description: 'Makeup presets and palettes.',
    itemCount: 40,
    sampleAssets: [
      { id: 12001, label: 'Smokey Eye' },
      { id: 12002, label: 'Natural Glow' },
    ],
  },
  {
    id: 'emotions',
    label: 'Emotions',
    description: 'Facial expressions and emotions.',
    itemCount: 12,
    sampleAssets: [
      { id: 13001, label: 'Happy' },
      { id: 13002, label: 'Surprised' },
    ],
  },
];

export const BRANDED_ASSETS = [
  { id: '10139', label: 'Baseball Uniform' },
  { id: '10170', label: 'Leprechaun Headband' },
  { id: '10198', label: 'Courtside Casual' },
];
