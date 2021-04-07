import cron from 'node-cron';
import changeService from "../service/changeService";

cron.schedule('*/1 * * * *', () => {
  const nameJob = 'PUSH IN CACHE NEW QUOTES';
  changeService
   .setQuotes()
   .then(() => console.log(`The job: ${nameJob} finished`))
   .catch((error) => console.error(`The job ${nameJob} has one error: ${JSON.stringify(error)}`));
});
