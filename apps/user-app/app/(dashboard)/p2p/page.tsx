import { getServerSession } from "next-auth";
import { P2PTransaction } from "../../../components/P2PTransactions";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getP2PTransaction() {
  const session = await getServerSession(authOptions);

  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: Number(session?.user?.id) },
        { toUserId: Number(session?.user?.id) }, // Assuming `toUserId` is the field you want to match with the second ID
      ],
    },
  });

  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    to: t.toUserId,
    dire: t.fromUserId == Number(session.user.id) ? "Send" : "Received",
  }));
}

export default async function () {
  const transactions = await getP2PTransaction();
  return (
    <div className="w-full">
      <SendCard />
      <div className="px-10 py-2">
        <P2PTransaction transactions={transactions} />
      </div>
    </div>
  );
}
