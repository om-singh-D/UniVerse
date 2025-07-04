-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Core user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL if using SSO only
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    profile_pic_url VARCHAR(500),
    bio TEXT,
    year_of_study INTEGER CHECK (year_of_study >= 1 AND year_of_study <= 5),
    major VARCHAR(100),
    
    -- SSO fields
    sso_provider VARCHAR(50), -- 'google', 'microsoft', etc.
    sso_id VARCHAR(255),
    
    -- Account status
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Privacy settings
    profile_visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'friends', 'private'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- User sessions for JWT token management
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories for confessions (optional filtering)
CREATE TABLE confession_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Confessions table
CREATE TABLE confessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- For moderation purposes
    content TEXT NOT NULL CHECK (LENGTH(content) <= 1000),
    category_id INTEGER REFERENCES confession_categories(id),
    
    -- Moderation
    is_approved BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    moderated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP WITH TIME ZONE,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace categories
CREATE TABLE marketplace_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Marketplace items
CREATE TABLE marketplace_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id INTEGER REFERENCES marketplace_categories(id),
    condition VARCHAR(20) DEFAULT 'good', -- 'new', 'like_new', 'good', 'fair', 'poor'
    
    -- Status and visibility
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'reserved', 'hidden'
    is_negotiable BOOLEAN DEFAULT TRUE,
    
    -- Location (optional)
    pickup_location VARCHAR(200),
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Item images
CREATE TABLE item_images (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES marketplace_items(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
);

-- Study groups
CREATE TABLE study_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    course_code VARCHAR(20),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Group settings
    is_private BOOLEAN DEFAULT FALSE,
    max_members INTEGER DEFAULT 50 CHECK (max_members > 0),
    requires_approval BOOLEAN DEFAULT FALSE,
    
    -- Group status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group memberships
CREATE TABLE group_memberships (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'member'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'pending', 'banned'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(group_id, user_id)
);

-- Events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    venue_details TEXT,
    
    -- Event timing
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Event metadata
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(50), -- 'academic', 'social', 'sports', 'cultural', etc.
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Event status
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
    is_public BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event RSVPs
CREATE TABLE event_rsvps (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rsvp_status VARCHAR(10) DEFAULT 'going', -- 'going', 'maybe', 'not_going'
    rsvp_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, user_id)
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'confession_approved', 'item_sold', 'event_reminder', etc.
    title VARCHAR(200) NOT NULL,
    content TEXT,
    
    -- Related entities (optional references)
    related_confession_id INTEGER REFERENCES confessions(id) ON DELETE CASCADE,
    related_item_id INTEGER REFERENCES marketplace_items(id) ON DELETE CASCADE,
    related_event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    related_group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    
    -- Notification state
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE, -- For email notifications
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Files table for general file uploads
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    uploader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100), -- MIME type
    file_size INTEGER, -- in bytes
    
    -- File categorization
    entity_type VARCHAR(50), -- 'confession', 'group', 'event', 'profile', etc.
    entity_id INTEGER, -- ID of the related entity
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments system (for confessions, marketplace items, etc.)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
    
    -- Polymorphic relationship
    commentable_type VARCHAR(50) NOT NULL, -- 'confession', 'marketplace_item'
    commentable_id INTEGER NOT NULL,
    
    -- Comment threading (optional)
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Likes/reactions system
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Polymorphic relationship
    likeable_type VARCHAR(50) NOT NULL, -- 'confession', 'comment'
    likeable_id INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, likeable_type, likeable_id)
);

-- Favorites (for marketplace items)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES marketplace_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, item_id)
);

-- Reports/flags for content moderation
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Polymorphic relationship
    reportable_type VARCHAR(50) NOT NULL, -- 'confession', 'comment', 'user', 'marketplace_item'
    reportable_id INTEGER NOT NULL,
    
    -- Report status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX idx_confessions_approved ON confessions(is_approved);
CREATE INDEX idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX idx_marketplace_items_category ON marketplace_items(category_id);
CREATE INDEX idx_marketplace_items_created_at ON marketplace_items(created_at DESC);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_comments_polymorphic ON comments(commentable_type, commentable_id);
CREATE INDEX idx_likes_polymorphic ON likes(likeable_type, likeable_id);

-- Insert initial data
INSERT INTO confession_categories (name, description) VALUES
('Academic', 'Study and course related confessions'),
('Social', 'Social life and relationships'),
('Campus Life', 'General campus experiences'),
('Personal', 'Personal thoughts and feelings'),
('Anonymous Tips', 'Anonymous suggestions and tips');

INSERT INTO marketplace_categories (name, description) VALUES
('Textbooks', 'Academic books and study materials'),
('Electronics', 'Laptops, phones, and gadgets'),
('Furniture', 'Dorm and apartment furniture'),
('Clothing', 'Clothes and accessories'),
('Sports & Recreation', 'Sports equipment and gear'),
('Other', 'Miscellaneous items');

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_confessions_updated_at BEFORE UPDATE ON confessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();