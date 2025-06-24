"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Receipt, ArrowLeft, Package } from "lucide-react"

// Sample products
const products = [
  { id: 1, name: "Rice (50kg)", price: 45000, stock: 25, unit: "bag" },
  { id: 2, name: "Cooking Oil (5L)", price: 8500, stock: 40, unit: "bottle" },
  { id: 3, name: "Sugar (1kg)", price: 1200, stock: 60, unit: "pack" },
  { id: 4, name: "Flour (2kg)", price: 2800, stock: 35, unit: "pack" },
  { id: 5, name: "Beans (1kg)", price: 1800, stock: 45, unit: "pack" },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  unit: string
}

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  const addToCart = () => {
    const product = products.find((p) => p.id.toString() === selectedProduct)
    if (!product) return

    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)))
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          unit: product.unit,
        },
      ])
    }

    setSelectedProduct("")
    setQuantity(1)
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const processSale = () => {
    const receipt = {
      id: `RCP-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: cart,
      total: getTotalAmount(),
      staff: "Sales Staff", // In real app, get from auth
    }

    setReceiptData(receipt)
    setShowReceipt(true)
    setCart([]) // Clear cart after sale
  }

  const printReceipt = () => {
    window.print()
  }

  if (showReceipt && receiptData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Button variant="ghost" onClick={() => setShowReceipt(false)} className="absolute left-4 top-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Receipt Generated</CardTitle>
              <CardDescription>Transaction completed successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Receipt Content */}
              <div className="bg-white p-6 border rounded-lg print:shadow-none">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">Business Name</h2>
                  <p className="text-sm text-gray-600">123 Business Street, Lagos</p>
                  <p className="text-sm text-gray-600">Tel: +234 xxx xxx xxxx</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Receipt #:</span>
                    <span>{receiptData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{receiptData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{receiptData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff:</span>
                    <span>{receiptData.staff}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  {receiptData.items.map((item: CartItem, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <div>{item.name}</div>
                        <div className="text-gray-500">
                          {item.quantity} {item.unit} × ₦{item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₦{receiptData.total.toLocaleString()}</span>
                </div>

                <div className="text-center mt-4 text-sm text-gray-600">
                  <p>Thank you for your business!</p>
                  <p>Goods sold are not returnable</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={printReceipt} className="flex-1">
                  <Receipt className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={() => setShowReceipt(false)} className="flex-1">
                  New Sale
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Sales Entry</h1>
          </div>
          <Badge variant="secondary">Sales Staff</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Add Products
              </CardTitle>
              <CardDescription>Select products to add to the sale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - ₦{product.price.toLocaleString()} ({product.stock} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                />
              </div>

              <Button onClick={addToCart} className="w-full" disabled={!selectedProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shopping Cart
                </div>
                <Badge variant="outline">{cart.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No items in cart</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ₦{item.price.toLocaleString()} per {item.unit}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>₦{getTotalAmount().toLocaleString()}</span>
                  </div>

                  <Button onClick={processSale} className="w-full" size="lg">
                    <Receipt className="mr-2 h-4 w-4" />
                    Process Sale
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
