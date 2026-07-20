/**
 * Seguridad y manejo de errores para flujos de firma (swap / liquidez).
 * Sin dependencias: testeable de forma aislada.
 */

/**
 * Guard duro pre-firma: consulta la red REAL de la wallet justo antes de
 * firmar, en vez de confiar en el estado de la UI (que puede quedar
 * desincronizado milisegundos si el usuario cambia de red a mitad de flujo).
 * Lanza un error con code WRONG_NETWORK que describeTxError sabe traducir.
 */
export async function assertChainBeforeSigning(
  provider: { getNetwork: () => Promise<{ chainId: number }> },
  expectedChainId: number
): Promise<void> {
  const net = await provider.getNetwork();
  if (net.chainId !== expectedChainId) {
    const err = new Error("Wallet is not on the expected network") as Error & { code: string };
    err.code = "WRONG_NETWORK";
    throw err;
  }
}

/**
 * Traduce cualquier error de wallet/RPC/contrato a un mensaje claro para el
 * usuario. Cubre los códigos EIP-1193 (4001, -32002), los de ethers v5
 * (ACTION_REJECTED, INSUFFICIENT_FUNDS, …) y los reverts de PancakeSwap.
 */
export function describeTxError(err: any): string {
  const code = err?.code;
  const innerCode = err?.error?.code ?? err?.data?.code;
  const msg: string =
    err?.error?.message || err?.reason || err?.shortMessage || err?.message || "";

  // Red incorrecta detectada por el guard pre-firma
  if (code === "WRONG_NETWORK")
    return "Wallet is on the wrong network — switch to BNB Chain and try again";

  // Usuario canceló en la wallet (EIP-1193 4001 / ethers v5)
  if (code === 4001 || innerCode === 4001 || code === "ACTION_REJECTED")
    return "Transaction cancelled";

  // Ya hay una solicitud esperando en la wallet (EIP-1193 -32002)
  if (code === -32002 || innerCode === -32002 || /already pending/i.test(msg))
    return "A request is already pending in your wallet — open it to continue";

  // Sin fondos para el monto + gas
  if (code === "INSUFFICIENT_FUNDS" || /insufficient funds/i.test(msg))
    return "Insufficient funds for amount + gas";

  // Reverts de PancakeSwap por movimiento de precio / slippage
  if (/INSUFFICIENT_OUTPUT_AMOUNT|INSUFFICIENT_A_AMOUNT|INSUFFICIENT_B_AMOUNT|EXCESSIVE_INPUT_AMOUNT/.test(msg))
    return "Price moved too much — try increasing slippage";

  // Deadline de la transacción vencido
  if (/EXPIRED/.test(msg))
    return "Transaction deadline expired — try again";

  // La simulación indica que la tx revertiría
  if (code === "UNPREDICTABLE_GAS_LIMIT" || code === "CALL_EXCEPTION")
    return "Transaction would fail — check amounts and allowances, then try again";

  // RPC caído o sin respuesta
  if (code === "NETWORK_ERROR" || code === "TIMEOUT" || /timeout|network error/i.test(msg))
    return "Network error — the RPC did not respond, please try again";

  return err?.shortMessage || err?.reason || err?.message || "Transaction failed";
}
