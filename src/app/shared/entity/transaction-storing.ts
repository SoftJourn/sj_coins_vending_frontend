export class TransactionStoring {

  id: number;
  blockNumber: number;
  time: string;
  chainId: string;
  txId: string;
  transaction: Map<string, Object>;
  callingValue: Map<string, Object>;

}
