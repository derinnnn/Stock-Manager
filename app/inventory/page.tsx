"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, Plus, Search, Edit, AlertTriangle, ArrowLeft, TrendingDown, TrendingUp } from "lucide-react"

// Sample inventory data
const initialInventory = [
  {
    id: 1,
    name: "Rice (50kg)",
    currentStock: 25,
    minStock: 10,
    unitPrice: 45000,
    unit: "bag",
    lastRestocked: "2024-01-15",
    supplier: "Lagos Rice Mills",
  },
  {
    id: 2,
    name: "Cooking Oil (5L)",
    currentStock: 8,
    minStock: 15,
    unitPrice: 8500,
    unit: "bottle",
    lastRestocked: "2024-01-10",
    supplier: "Golden Oil Ltd",
  },
  {
    id: 3,
    name: "Sugar (1kg)",
    currentStock: 12,
    minStock: 20,
    unitPrice: 1200,
    unit: "pack",
    lastRestocked: "2024-01-12",
    supplier: "Sweet Sugar Co",
  },
  {
    id: 4,
    name: "Flour (2kg)",
    currentStock: 35,
    minStock: 15,
    unitPrice: 2800,
    unit: "pack",
    lastRestocked: "2024-01-14",
    supplier: "Flour Mills Nigeria",
  },
  {
    id: 5,
    name: "Beans (1kg)",
    currentStock: 45,
    minStock: 20,
    unitPrice: 1800,
    unit: "pack",
    lastRestocked: "2024-01-13",
    supplier: "Northern Beans",
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    currentStock: 0,
    minStock: 0,
    unitPrice: 0,
    unit: "",
    supplier: "",
  })

  const filteredInventory = inventory.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= minimum) return "critical"
    if (current <= minimum * 1.5) return "low"
    return "good"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "low":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Low Stock
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Good
          </Badge>
        )
    }
  }

  const addProduct = () => {
    const product = {
      id: inventory.length + 1,
      ...newProduct,
      lastRestocked: new Date().toISOString().split("T")[0],
    }
    setInventory([...inventory, product])
    setNewProduct({
      name: "",
      currentStock: 0,
      minStock: 0,
      unitPrice: 0,
      unit: "",
      supplier: "",
    })
    setIsAddDialogOpen(false)
  }

  const updateStock = (id: number, newStock: number) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, currentStock: newStock } : item)))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Inventory Management</h1>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter the details for the new product</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Rice (50kg)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newProduct.currentStock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, currentStock: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({ ...newProduct, minStock: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price (₦)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      value={newProduct.unitPrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, unitPrice: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      placeholder="e.g., bag, bottle, pack"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>

                <Button onClick={addProduct} className="w-full">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">Active inventory items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {inventory.filter((item) => getStockStatus(item.currentStock, item.minStock) !== "good").length}
              </div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{inventory.reduce((total, item) => total + item.currentStock * item.unitPrice, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Manage your product inventory and stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">Last restocked: {item.lastRestocked}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>
                            {item.currentStock} {item.unit}
                          </span>
                          {item.currentStock <= item.minStock && <TrendingDown className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.minStock} {item.unit}
                      </TableCell>
                      <TableCell>₦{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(getStockStatus(item.currentStock, item.minStock))}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newStock = prompt(`Enter new stock for ${item.name}:`, item.currentStock.toString())
                              if (newStock) updateStock(item.id, Number.parseInt(newStock))
                            }}
                          >
                            Update Stock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
