// @ts-nocheck
import fs from 'fs';
import papa from 'papaparse';
import { prisma } from './prisma';
import path from 'path';

async function importBlockedEmails() {
  const fileName = 'blocked.csv';
  const filePath = path.join(__dirname, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const csvFile = fs.readFileSync(filePath, 'utf8');

    return new Promise((resolve, reject) => {
      papa.parse(csvFile, {
        complete: async (results) => {
          const emails = results.data
            .filter((row: string[]) => row.length >= 1 && row[0].includes('@'))
            .map((row: string[]) => row[0].trim());

          console.log(`Found ${emails.length} valid email addresses`);

          try {
            const createdEmails = await prisma.blockedEmail.createMany({
              data: emails.map((email) => ({ email })),
              skipDuplicates: true,
            });
            console.log(`Successfully added ${createdEmails.count} blocked emails to the database`);
            resolve();
          } catch (error) {
            console.error('Error adding blocked emails to the database:', error);
            reject(error);
          } finally {
            await prisma.$disconnect();
          }
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}

async function main() {
  try {
    await importBlockedEmails();
    console.log('Import process completed successfully');
  } catch (error) {
    console.error('Import process failed:', error);
  }
}

// await main();
