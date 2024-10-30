import BeeQueue from 'bee-queue';
import { redisConfig } from '../config/redis';
import CreateOrderMail from '../jobs/CreateOrderMail';
import PayOrderMail from '../jobs/PayOrderMail';

class Queue {
  queues: {
    [key: string]: {
      bee: BeeQueue<any>;
      handle: () => Promise<void>;
    };
  };
  jobs: IJob[] = [CreateOrderMail, PayOrderMail];

  constructor() {
    this.queues = {};

    this.init();
    console.log('queue running');
  }

  init() {
    this.jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new BeeQueue(key, {
          redis: redisConfig
        }),
        handle
      };
    });
  }

  add(queue: string, job: unknown) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    this.jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job: any, err: Error) {
    console.log(job.queue.name);
    console.log(err);
  }
}

export default new Queue();
