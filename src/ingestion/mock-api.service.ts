import { Injectable } from '@nestjs/common';

@Injectable()
export class MockApiService {
  /**
   * Simulates an API call with random success/failure behavior
   */
  async processIngestion(
    source: string,
    destination: string,
    metadata?: any,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    // Simulate processing delay between 1-5 seconds
    const processingTime = Math.floor(Math.random() * 4000) + 1000;

    return new Promise(resolve => {
      setTimeout(() => {
        // 80% success rate for demo purposes
        const isSuccess = Math.random() < 0.8;

        if (isSuccess) {
          resolve({
            success: true,
            message: 'Ingestion completed successfully',
            data: {
              recordsProcessed: Math.floor(Math.random() * 1000) + 1,
              processingTimeMs: processingTime,
            },
          });
        } else {
          // Random failure reasons for simulation
          const errors = [
            'Connection timeout',
            'Source unavailable',
            'Destination unreachable',
            'Invalid data format',
            'Processing error',
          ];
          const errorIndex = Math.floor(Math.random() * errors.length);

          resolve({
            success: false,
            message: `Ingestion failed: ${errors[errorIndex]}`,
          });
        }
      }, processingTime);
    });
  }
}
