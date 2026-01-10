import { Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGO_URI ?? '';
const client = new MongoClient(uri);

@Module({
  providers: [
    {
      provide: 'MONGO_DB',
      useFactory: async () => {
        try {
          await client.connect();
          const db = client.db('dev-match');
          console.log(
            `MongoDB connected successfully to database ${db.databaseName}`,
          );
          return db;
        } catch (error: unknown) {
          if (error instanceof Error) console.log(error.message);
          else console.log('Something went wrong while connecting to MongoDB');
        }
      },
    },
  ],
  exports: ['MONGO_DB'],
})
export class MongodbModule {}
