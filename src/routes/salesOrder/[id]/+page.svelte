<script lang="ts">
    import '$lib/styles/app.css';
    import type { PageData } from './$types';

    export let data: PageData;
    const { salesOrder } = data;

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    }

        function getStatusColor(status: string) {
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending approval':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-white text-blue-800';
        }
    }

    
</script>

<div class="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-white">Sales Order</h1>
                <p class="text-white opacity-80">#{salesOrder.salesorder_number}</p>
            </div>
            <div class="{getStatusColor(salesOrder.status)} px-4 py-2 rounded-full font-semibold shadow-lg">
                {salesOrder.status.toUpperCase()}
            </div>
        </div>

        <div class="p-6 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-blue-900">Customer Information</h2>
                    <div class="bg-slate-50 p-4 rounded-lg">
                        <p class="text-slate-800"><span class="font-medium">Name:</span> {salesOrder.customer_name}</p>
                        <p class="text-slate-800"><span class="font-medium">Contact:</span> {salesOrder.contact_person_details[0].first_name} {salesOrder.contact_person_details[0].last_name}</p>
                        <p class="text-slate-800"><span class="font-medium">Phone:</span> {salesOrder.contact_person_details[0].mobile}</p>
                        <p class="text-slate-800"><span class="font-medium">GSTIN:</span> {salesOrder.customer_gst_no}</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-blue-900">Order Information</h2>
                    <div class="bg-slate-50 p-4 rounded-lg">
                        <p class="text-slate-800"><span class="font-medium">Date:</span> {formatDate(salesOrder.date)}</p>
                        <p class="text-slate-800"><span class="font-medium">Reference:</span> {salesOrder.reference_number}</p>
                        <p class="text-slate-800"><span class="font-medium">Delivery Method:</span> {salesOrder.delivery_method}</p>
                        <p class="text-slate-800"><span class="font-medium">Salesperson:</span> {salesOrder.salesperson_name}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-blue-900">Shipping Address</h2>
                <div class="bg-slate-50 p-4 rounded-lg">
                    <p class="text-slate-800">
                        {salesOrder.shipping_address.address}<br>
                        {salesOrder.shipping_address.street2}<br>
                        {salesOrder.shipping_address.city}, {salesOrder.shipping_address.state} {salesOrder.shipping_address.zip}<br>
                        {salesOrder.shipping_address.country}
                    </p>
                </div>
            </div>
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-blue-900">Line Items</h2>
            <div class="overflow-x-auto bg-slate-50 rounded-lg">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">HSN/SAC</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Qty</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Rate</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        {#each salesOrder.line_items as item}
                            <tr class="hover:bg-slate-50 transition duration-150">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p class="text-sm text-slate-800 font-medium">{item.name}</p>
                                    <p class="text-xs text-slate-600 mt-1">{item.description}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.hsn_or_sac}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.quantity} {item.unit}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatCurrency(item.rate)}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{formatCurrency(item.item_total)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-blue-900">Order Summary</h2>
                <div class="bg-slate-50 p-6 rounded-lg space-y-3">
                    <div class="flex justify-between text-slate-800">
                        <span>Sub Total:</span>
                        <span class="font-medium">{formatCurrency(salesOrder.sub_total)}</span>
                    </div>
                    {#each salesOrder.taxes as tax}
                        <div class="flex justify-between text-slate-800">
                            <span>{tax.tax_name}:</span>
                            <span class="font-medium">{tax.tax_amount_formatted}</span>
                        </div>
                    {/each}
                    <div class="flex justify-between text-lg font-semibold text-blue-800 pt-3 border-t border-slate-300">
                        <span>Total:</span>
                        <span>{formatCurrency(salesOrder.total)}</span>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-blue-900">Additional Notes</h2>
                <div class="bg-slate-50 p-4 rounded-lg">
                    <p class="text-slate-800 whitespace-pre-line">{salesOrder.notes}</p>
                </div>
            </div>
        </div>
    </div>
</div>