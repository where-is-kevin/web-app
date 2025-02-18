import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

webpush.setVapidDetails(
    'mailto:andrej.barna.development@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

// Helper function to convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer)
    let base64String = ''
    for (let i = 0; i < byteArray.byteLength; i++) {
        base64String += String.fromCharCode(byteArray[i])
    }
    return btoa(base64String)
}

// Subscribe User
export async function subscribeUser(sub: PushSubscription) {
    try {
        // Get the keys from PushSubscription
        const keys = {
            p256dh: sub.getKey('p256dh') ? bufferToBase64(sub.getKey('p256dh')!) : null,
            auth: sub.getKey('auth') ? bufferToBase64(sub.getKey('auth')!) : null,
        }

        supabase.schema('whereiskevin')

        // Check if the subscription already exists in Supabase
        const { data: existingSub, error: findError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('endpoint', sub.endpoint)
            .single()

        if (!existingSub) {
            // Insert a new subscription into Supabase
            const { data, error } = await supabase
                .from('subscriptions')
                .insert({
                    endpoint: sub.endpoint,
                    keys: keys,  // Store the keys as JSON
                    expiration_time: sub.expirationTime ?? null,
                })

            if (error) throw error
        }

        return { success: true }
    } catch (error) {
        console.error('Error subscribing user:', error)
        return { success: false, error: 'Failed to subscribe user' }
    }
}

// Unsubscribe User
export async function unsubscribeUser(endpoint: string) {
    try {
        // Remove the subscription from Supabase
        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('endpoint', endpoint)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error unsubscribing user:', error)
        return { success: false, error: 'Failed to unsubscribe user' }
    }
}

// Send Push Notification
export async function sendNotification(message: string) {
    try {
        // Fetch all subscriptions from Supabase
        const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('*')

        if (error) throw error
        if (!subscriptions || subscriptions.length === 0) {
            throw new Error('No subscriptions available')
        }

        // Send notification to each subscription
        const notificationPromises = subscriptions.map((sub) =>
            webpush.sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: sub.keys,
                },
                JSON.stringify({
                    title: 'Where is Kevin',
                    body: message,
                    icon: '/web-app-manifest-192x192.png',
                })
            )
        )

        await Promise.all(notificationPromises)

        return { success: true }
    } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: 'Failed to send notification' }
    }
}
