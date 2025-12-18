
import React from 'react';
import { Scripture } from './types';

export const SCRIPTURES: Scripture[] = [
  {
    reference: "Proverbs 15:1",
    text: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
    category: 'anger'
  },
  {
    reference: "James 1:19",
    text: "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry.",
    category: 'listening'
  },
  {
    reference: "Ephesians 4:29",
    text: "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up according to their needs, that it may benefit those who listen.",
    category: 'peace'
  },
  {
    reference: "Proverbs 18:21",
    text: "The tongue has the power of life and death, and those who love it will eat its fruit.",
    category: 'peace'
  },
  {
    reference: "Colossians 4:6",
    text: "Let your conversation be always full of grace, seasoned with salt, so that you may know how to answer everyone.",
    category: 'peace'
  },
  {
    reference: "Proverbs 31:26",
    text: "She speaks with wisdom, and faithful instruction is on her tongue.",
    category: 'peace'
  }
];

export const I_PHRASES = ["I feel", "I think", "I need", "I believe", "I am hurt"];
export const YOU_PHRASES = ["You always", "You never", "Because you", "You should", "It's your fault"];
export const PRAISE_PHRASES = ["I appreciate", "Thank you", "You are good at", "I value", "Good job", "I love how you"];
export const TENSION_PHRASES = ["Hurt", "Angry", "Stop", "Whatever", "Not fair"];

export const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  peace: '#ecfdf5',
  praise: '#f0f9ff'
};
