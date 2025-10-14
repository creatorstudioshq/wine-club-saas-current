// components/InventoryPageSimple.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search, RefreshCw, Wine, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";
const ITEMS_PER_PAGE = 24; // 8 rows × 3 columns

type WineItem = {
  square_item_id: string;
  name: string;
  category_name: string;
  image_url: string | null;
  description: string;
  varietal: string;
  sweetness: string;
  color: string;
  variations: {
    id: string;
    name: string;
    price: number;
    inventory_count: number;
    varietal: string;
    sweetness: string;
    color: string;
  }[];
  total_inventory: number;
};

export function InventoryPageSimple() {
  const [loading, setLoading] = useState(true);
  const [wines, setWines] = useState<WineItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  async function load() {
    setLoading(true);
    try {
      const response = await api.getLiveInventory(
        KING_FROSCH_ID,
        'all',
        0  // 0 means no limit - get all items
      );
      
      // Filter out wines with "Uncategorized" category
      const filteredWines = (response.wines || []).filter(
        wine => wine.category_name.toLowerCase() !== 'uncategorized'
      );
      
      // Filter out "Uncategorized" from category list
      const filteredCategories = (response.availableCategories || []).filter(
        cat => cat.toLowerCase() !== 'uncategorized'
      );
      
      setWines(filteredWines);
      setCategories(filteredCategories);
      
      console.log(`Loaded ${filteredWines.length} wines from Square (excluded Uncategorized)`);
    } catch (error) {
      console.error("Failed to load inventory:", error);
      setWines([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = wines.filter((wine) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      wine.name.toLowerCase().includes(q) ||
      wine.description.toLowerCase().includes(q) ||
      wine.category_name.toLowerCase().includes(q) ||
      wine.varietal.toLowerCase().includes(q) ||
      wine.color.toLowerCase().includes(q);
    
    const matchesCategory = selectedCategory === "all" || wine.category_name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedWines = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h1>Wine Inventory</h1>
        <p className="text-muted-foreground">
          Real-time wine catalog from Square with live inventory tracking.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wines by name, description, varietal..."
            className="pl-9"
          />
        </div>
        
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
        
        <button
          onClick={load}
          className="inline-flex items-center justify-center text-sm px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading live inventory from Square...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Wine className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3>No wines found</h3>
            <p className="text-muted-foreground mt-2">
              {search || selectedCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "No wines available in inventory"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} wines
              {filtered.length !== wines.length && ` (filtered from ${wines.length} total)`}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedWines.map((wine) => {
              // Get primary variation for pricing
              const primaryVariation = wine.variations[0];
              const price = primaryVariation ? primaryVariation.price / 100 : 0;
              
              return (
                <Card key={wine.square_item_id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {wine.image_url ? (
                        <img
                          src={wine.image_url}
                          alt={wine.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Wine className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    
                    <h3 className="font-medium mb-1 line-clamp-2">{wine.name}</h3>
                    
                    {wine.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {wine.description.slice(0, 100)}
                        {wine.description.length > 100 ? '...' : ''}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg">
                        ${price.toFixed(2)}
                      </span>
                      <Badge variant="secondary">{wine.category_name}</Badge>
                    </div>
                    
                    {/* Wine attributes */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {wine.color && (
                        <Badge variant="outline" className="text-xs">
                          {wine.color}
                        </Badge>
                      )}
                      {wine.varietal && (
                        <Badge variant="outline" className="text-xs">
                          {wine.varietal}
                        </Badge>
                      )}
                      {wine.sweetness && (
                        <Badge variant="outline" className="text-xs">
                          {wine.sweetness}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Inventory count */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>{wine.total_inventory} in stock</span>
                      </div>
                      {wine.variations.length > 1 && (
                        <span className="text-xs text-muted-foreground">
                          {wine.variations.length} variations
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <Button
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      className="w-10"
                    >
                      1
                    </Button>
                    {currentPage > 4 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                  </>
                )}
                
                {/* Pages around current */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show current page and 2 pages on either side
                    return page >= currentPage - 2 && page <= currentPage + 2;
                  })
                  .map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                
                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
