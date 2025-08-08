-- Migration: Create Categories Table
-- Description: Creates hierarchical product categories table
-- Date: August 8, 2025

-- Create the categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    icon_name VARCHAR(50), -- For UI icons (e.g., 'vegetables', 'fruits')
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get category hierarchy path
CREATE OR REPLACE FUNCTION get_category_path(category_id INTEGER)
RETURNS TEXT AS $$
DECLARE
    path TEXT := '';
    current_id INTEGER := category_id;
    current_name VARCHAR(100);
    parent_id_val INTEGER;
BEGIN
    WHILE current_id IS NOT NULL LOOP
        SELECT name, parent_id INTO current_name, parent_id_val 
        FROM categories 
        WHERE id = current_id;
        
        IF current_name IS NULL THEN
            EXIT;
        END IF;
        
        IF path = '' THEN
            path := current_name;
        ELSE
            path := current_name || ' > ' || path;
        END IF;
        
        current_id := parent_id_val;
    END LOOP;
    
    RETURN path;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE categories IS 'Hierarchical product categories for organizing products';
COMMENT ON COLUMN categories.id IS 'Unique identifier for category';
COMMENT ON COLUMN categories.name IS 'Display name of the category';
COMMENT ON COLUMN categories.slug IS 'URL-friendly version of category name';
COMMENT ON COLUMN categories.parent_id IS 'Reference to parent category for hierarchy';
COMMENT ON COLUMN categories.image_url IS 'Category representative image URL';
COMMENT ON COLUMN categories.icon_name IS 'Icon identifier for UI display';
COMMENT ON COLUMN categories.sort_order IS 'Order for displaying categories';
COMMENT ON COLUMN categories.seo_title IS 'SEO optimized title';
COMMENT ON COLUMN categories.seo_description IS 'SEO meta description';
