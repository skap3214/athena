import { v5 as uuidv5 } from 'uuid';

export default function generateUUID(input: string): string {
    const namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341'; // Example namespace UUID
    const uuid = uuidv5(input, namespace);
    return uuid;
}