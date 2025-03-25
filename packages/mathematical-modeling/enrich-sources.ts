import { createClient } from '@vercel/postgres';
import { OpenAI } from 'openai';
import * as csv from 'csv-parse';
import * as fs from 'fs';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Postgres client
const db = createClient({
  connectionString: process.env.POSTGRES_URL
});

interface DataSource {
  id: string;
  url: string;
  quote: string | null;
  created_at: Date;
  updated_at: Date;
  author: string | null;
  title: string | null;
  publication: string | null;
  year: number | null;
  doi: string | null;
  citation_type: string | null;
}

async function enrichSource(url: string): Promise<Partial<DataSource>> {
  const prompt = `Extract academic metadata from this URL: ${url}
  Return a JSON object with these fields:
  - author: string (main author or organization)
  - title: string (full title of the work)
  - publication: string (journal or website name)
  - year: number (publication year)
  - doi: string (DOI if available)
  - citation_type: "journal" | "website" | "report"
  - quote: string (key finding or abstract first sentence)
  
  If a field cannot be determined, set it to null.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(completion.choices[0].message.content);
  return result;
}

async function main() {
  await db.connect();

  // Read CSV file
  const parser = fs.createReadStream('datasources.csv')
    .pipe(csv.parse({ columns: true }));

  for await (const row of parser) {
    // Skip if all metadata fields are populated
    if (row.author && row.title && row.publication && row.year && row.doi) {
      console.log(`Skipping ${row.url} - already enriched`);
      continue;
    }

    console.log(`Enriching ${row.url}...`);
    try {
      const enriched = await enrichSource(row.url);
      
      // Update database
      await db.query(
        `UPDATE datasources 
         SET author = $1, title = $2, publication = $3, 
             year = $4, doi = $5, citation_type = $6, quote = $7,
             updated_at = NOW()
         WHERE id = $8`,
        [
          enriched.author,
          enriched.title,
          enriched.publication,
          enriched.year,
          enriched.doi,
          enriched.citation_type,
          enriched.quote,
          row.id
        ]
      );

      console.log(`Updated ${row.url} with new metadata`);
    } catch (error) {
      console.error(`Error enriching ${row.url}:`, error);
    }
  }

  await db.end();
}

main().catch(console.error); 