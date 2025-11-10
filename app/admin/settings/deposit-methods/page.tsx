import { requireAdmin } from '@/lib/admin-helpers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CryptoDepositMethodsManager } from '@/components/admin/crypto-deposit-methods-manager'
import { P2PDepositMethodsManager } from '@/components/admin/p2p-deposit-methods-manager'
import { BankTransferMethodsManager } from '@/components/admin/bank-transfer-methods-manager'
import { 
  getCryptoDepositMethodsAction, 
  getP2PDepositMethodsAction, 
  getBankTransferMethodsAction 
} from '@/server/actions/admin/deposit-settings'

interface CryptoMethod {
  symbol: string
  name: string
  address: string
  network: string
  icon: string
  is_active: boolean
  min_deposit: number
  confirmations_required: number
}

interface P2PMethod {
  id: string
  name: string
  icon: string
  username: string
  account_id: string
  is_active: boolean
  instructions: string
}

interface BankMethod {
  id: string
  bank_name: string
  account_name: string
  account_number: string
  routing_number?: string
  swift_code?: string
  iban?: string
  bank_address?: string
  is_active: boolean
  instructions?: string
  icon?: string
}

export default async function AdminDepositMethodsPage() {
  await requireAdmin()
  
  const [cryptoResult, p2pResult, bankResult] = await Promise.all([
    getCryptoDepositMethodsAction(),
    getP2PDepositMethodsAction(),
    getBankTransferMethodsAction(),
  ])

  const cryptoMethods = (cryptoResult.success && Array.isArray(cryptoResult.data) ? cryptoResult.data : []) as unknown as CryptoMethod[]
  const p2pMethods = (p2pResult.success && Array.isArray(p2pResult.data) ? p2pResult.data : []) as unknown as P2PMethod[]
  const bankMethods = (bankResult.success && Array.isArray(bankResult.data) ? bankResult.data : []) as unknown as BankMethod[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deposit Methods Management</h1>
        <p className="text-muted-foreground mt-1">
          Configure cryptocurrency addresses, P2P payment methods, and bank transfer details
        </p>
      </div>

      <Tabs defaultValue="crypto" className="space-y-6">
        <TabsList>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="p2p">P2P Payments</TabsTrigger>
          <TabsTrigger value="bank">Bank Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="crypto">
          <CryptoDepositMethodsManager methods={cryptoMethods} />
        </TabsContent>

        <TabsContent value="p2p">
          <P2PDepositMethodsManager methods={p2pMethods} />
        </TabsContent>

        <TabsContent value="bank">
          <BankTransferMethodsManager methods={bankMethods} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
