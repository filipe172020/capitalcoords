export interface Participant {
  key: string;
  slug: string;
  name: string;
  shortName: string;
  sport: string;
}

export interface Event {
  key: string;
  name: string;
  startTime: string;
  homeParticipantKey: string;
  participants: Participant[];
}

export interface Market {
  key: string;
  type: string;
  segment: string;
  lastFoundAt: string;
  event?: Event; 
}

export interface Advantage {
  key: string;
  type: string;
  lastFoundAt: string;
  createdAt: string;
  market: Market;
  outcomes: any[]; 
}

export interface ApiResponse {
  advantages: Advantage[];
}
