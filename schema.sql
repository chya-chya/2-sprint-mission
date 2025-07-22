CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  tags VARCHAR(255)[],
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  CONSTRAINT products_userId_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE product_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  product_id INT NOT NULL,
  CONSTRAINT product_comments_productId_fkey
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE,
  user_id INT NOT NULL,
  CONSTRAINT product_comments_userId_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  CONSTRAINT articles_userId_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE article_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  article_id INT NOT NULL,
  CONSTRAINT article_comments_articleId_fkey
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE,
  user_id INT NOT NULL,
  CONSTRAINT article_comments_userId_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE product_likes (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  product_id INT NOT NULL,
  CONSTRAINT product_likes_productId_fkey
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE,
  user_id INT NOT NULL,
  CONSTRAINT product_likes_userId_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE TABLE article_likes (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  article_id INT NOT NULL,
  CONSTRAINT article_likes_articleId_fkey
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE,
  user_id INT NOT NULL,
  CONSTRAINT article_likes_userId_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_user_article UNIQUE (user_id, article_id)
);