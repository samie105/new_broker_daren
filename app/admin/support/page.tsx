import { requireAdmin } from '@/lib/admin-helpers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllFaqsAction, getAllContactsAction } from '@/server/actions/admin/support'
import { FaqsManagement } from '@/components/admin/faqs-management'
import { ContactsManagement } from '@/components/admin/contacts-management'

export default async function AdminSupportPage() {
  await requireAdmin()
  
  const [faqsResult, contactsResult] = await Promise.all([
    getAllFaqsAction(),
    getAllContactsAction(),
  ])

  const faqs = faqsResult.success ? faqsResult.data : []
  const contacts = contactsResult.success ? contactsResult.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage FAQs, support contacts, and help center content
        </p>
      </div>

      <Tabs defaultValue="faqs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contacts">Support Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs">
          <FaqsManagement faqs={faqs || []} />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsManagement contacts={contacts || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
