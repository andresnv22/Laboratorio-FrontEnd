import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {
  private readonly productService = inject(ProductService);

  readonly allProducts = this.productService.getAll();
  readonly categories: Product['category'][] = ['Bloques', 'Peluches', 'Vehículos', 'Juegos de mesa'];
  readonly selectedCategories = signal<Set<Product['category']>>(new Set());

  readonly filteredProducts = computed(() => {
    const selected = this.selectedCategories();
    if (selected.size === 0) {
      return this.allProducts;
    }
    return this.allProducts.filter((p) => selected.has(p.category));
  });

  toggleCategory(category: Product['category']): void {
    const next = new Set(this.selectedCategories());
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    this.selectedCategories.set(next);
  }

  isSelected(category: Product['category']): boolean {
    return this.selectedCategories().has(category);
  }
}
