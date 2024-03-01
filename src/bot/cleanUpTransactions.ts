import { transactions } from "@/vars/transactions";
import { sendAlert } from "./sendAlert";
import { log } from "@/utils/handlers";
import {
  ALERT_INTERVAL,
  MC_TRACK_THRESHOLD,
  VOLUME_THRESHOLD,
} from "@/utils/constants";
import { hypeNewPairs } from "@/vars/pairs";

export function cleanUpTransactions() {
  log("Cleanup initiated");
  const currentTime = Math.floor(Date.now() / 1000);

  for (const token in transactions) {
    const storedToken = transactions[token];
    const secondsElapsed = currentTime - storedToken.startTime;
    const { totalBuy } = storedToken;

    if (totalBuy > VOLUME_THRESHOLD) {
      sendAlert(token, storedToken).then(() => {
        delete transactions[token];
      });
    }

    if (secondsElapsed > ALERT_INTERVAL) {
      delete transactions[token];
      log(`Removed token ${token}`);
    }
  }

  for (const pair in hypeNewPairs) {
    const { startTime } = hypeNewPairs[pair];
    const secondsElapsed = currentTime - startTime;

    if (secondsElapsed >= MC_TRACK_THRESHOLD) {
      delete hypeNewPairs[pair];
    }
  }
}
