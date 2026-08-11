export type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
};

export const CATEGORIES = [
  { slug: "fashion", name: "Fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
  { slug: "Perfume", name: "Perfume", image: "https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/612179871_862298189888619_3825738627120528813_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeGs1uYe1SRlKpJbep1sJenHK6dhhhOsYWcrp2GGE6xhZyVZqR5Fb45iIQRyXm_IcTfeMH7MYJReqZeXNL9Ukmvx&_nc_ohc=G4n0PycTx0UQ7kNvwGEkdF1&_nc_oc=AdolR1NJcNZwJKLPBUymHv2SJAtz0R1Q469GIW7IfyKFKnpmrgpXQaeK8W9XTBskqk8&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=U7pGTSNNunVGuzOJKQodlQ&_nc_ss=7b2a8&oh=00_Af4vsCNzRt5KDlmSxqBYTfj-947dkZYAZurTC8X5XX-Ztg&oe=69FFEA31" },
  { slug: "electronics", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80" },
  { slug: "home", name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
  { slug: "toys", name: "Toys & Games", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80" },
  { slug: "books", name: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80" },
  { slug: "grocery", name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
  { slug: "sports", name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80" },
];

const img = (id: string) => `https://images.unsplash.com/${id}?w=500&q=80`;

export const PRODUCTS: Product[] = [
  // Fashion
  { id: "f1", title: "Men's Classic Denim Jacket", price: 49.99, oldPrice: 79.99, rating: 4.5, reviews: 1240, image: img("photo-1551028719-00167b16eac5"), category: "fashion" },
  { id: "f2", title: "Women's Summer Floral Dress", price: 34.5, oldPrice: 59.0, rating: 4.6, reviews: 982, image: img("photo-1572804013309-59a88b7e92f1"), category: "fashion" },
  { id: "f3", title: "Leather Crossbody Handbag", price: 79.0, rating: 4.7, reviews: 654, image: img("photo-1548036328-c9fa89d128fa"), category: "fashion" },
  { id: "f4", title: "Unisex Running Sneakers", price: 64.99, oldPrice: 89.99, rating: 4.4, reviews: 2310, image: img("photo-1542291026-7eec264c27ff"), category: "fashion" },
  { id: "f5", title: "Aviator Sunglasses", price: 19.99, rating: 4.3, reviews: 540, image: img("photo-1572635196237-14b3f281503f"), category: "fashion" },
  { id: "f6", title: "Wool Winter Beanie", price: 14.99, rating: 4.6, reviews: 312, image: img("photo-1576871337622-98d48d1cf531"), category: "fashion" },

  // Perfume
  { id: "b1", title: "louis vuitton ombre nomade 2ml", price: 10.2, oldPrice: 15.3, rating: 4.7, reviews: 1845, image:"https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/682959834_949717254480045_4721157438063910716_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=v5tsC3auC1QQ7kNvwFNPk2K&_nc_oc=AdpXlO6CFQgGqEtrDF-JNnxY-GZJWNS69A1EWb5zVPfBRa8lsHH-t-zGjUTjNu-T2I8&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=VUvI_PGNpQTBv-5otst4dA&_nc_ss=7b2a8&oh=00_Af5bLl3pkzwHxaGO-TC-2GbjE7C8vx0Mk9BhETDNIrw2ag&oe=69FFF5AE" , category: "Perfume" },
  { id: "b2", title: "Al Haramain Natural Iris 100ml", price: 72.45, rating: 4.5, reviews: 921, image:"https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/637709869_895210923264012_3401003697995551246_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=jNU8SyDD5CMQ7kNvwFWbd2-&_nc_oc=AdqC0wS1dxJOh2P_rtkm-SkeS_OFfkdt2QWLWnHn76WsBvkRv6fJ902Mf6eTf6M7Sq4&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=Bna2_ixNppG5tMuXd5S3ww&_nc_ss=7b2a8&oh=00_Af6nBGaoJlG6yo00aQEqo47kIZiKWvC41YvyDTcf0kSwnA&oe=69FFB05B",category: "Perfume" },
  { id: "b3", title: "Cedrat Boise 100ml", price: 75.99, oldPrice: 90.50, rating: 4.6, reviews: 1320,image:"https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/604557628_850655701052868_6876882701433551202_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=7b2446&_nc_ohc=ck0_gkg-B2AQ7kNvwEhWkRj&_nc_oc=AdppklSfZl_KBkiKZCqD7pfpU9ebTbz0DnPyIbQq9lA3RH2oX3A6LEh-ULrfRsfvDnQ&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=BIemt9dgTa4zvIg40HqUNQ&_nc_ss=7b2a8&oh=00_Af49qtiCkWb1DE2z6wF1kpEmztTl34xH5ofiHanY97feQQ&oe=69FFF670", category: "Perfume" },
  { id: "b4", title: "Club de Nuit Intense Man Limited Edition Parfum Armaf 100ml", price: 80.88, rating: 4.4, reviews: 5023, image:"  https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/681835371_4335896596666858_4660717425079232812_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e06c5d&_nc_eui2=AeHVBOJQ56BRm3FrfkTbDDgrh7fX9Rk7jlmHt9f1GTuOWS-JgK5AFbEKAJlShFokLitnJOuEY9Hk4IFOLyOXNF94&_nc_ohc=1q3Og555C4UQ7kNvwFPtSpE&_nc_oc=Ado6iJJA-2VRAGPGZGNue18UDXEqKlQhocDNb6h4brLAlj8O5VZ5q280DpRRFL5pqfo&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=AHDXkj5XpUKTYRkfFOhxyQ&_nc_ss=7b2a8&oh=00_Af53e7wn2vZkR-jKQrJ2l1BnNn_TQ7KKJEv-Iu3sNMUGqg&oe=6A000215 " , category: "Perfume" },
  { id: "b5", title: "Odyssey Mandarin Sky Armaf 100ml", price: 45.00, rating: 4.5, reviews: 410,image:"https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/643516940_902311312553973_1248417215868238759_n.jpg?stp=c0.169.1536.1536a_cp6_dst-jpg_s206x206_tt6&_nc_cat=111&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=RlWG8MU_JTcQ7kNvwFFLb2X&_nc_oc=Adr-2dmmhMlHIyXXArcbZtUQYgYN9L9scRcEX2UMxvrAmXYsCpy19Fc79slYsdL7KN8&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=CvMaHtW-U2EkYmR6kg-N8w&_nc_ss=7b2a8&oh=00_Af7eALlzHdD_9m_WY6oOz79UCg-3ww1M9uAiwKjq0b67Pw&oe=69FFF0EA", category: "Perfume" },
  { id: "b6", title: "Spicebomb Viktor&Rolf 100ml", price: 88.99, oldPrice: 99.99, rating: 4.6, reviews: 1502, image:"https://scontent.fdac7-1.fna.fbcdn.net/v/t39.30808-6/622577364_877990881652683_1293100098666797261_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=6bzV7Bt85NAQ7kNvwGw51-j&_nc_oc=AdpME9AWnj5kyt6UP9s5fjNvZFyENXlXC-gldjAcbQiqaOkGRCZtXS-HTaUC_YM5BKQ&_nc_zt=23&_nc_ht=scontent.fdac7-1.fna&_nc_gid=x_ViAgcSQevkkf6rt-RKKg&_nc_ss=7b2a8&oh=00_Af6XLkqUVupxgJ7mzEjyhmTsB1vI_nq-kjJmeCCD1B-Vjg&oe=69FFE541" , category: "Perfume" },

  // Electronics
  { id: "e1", title: "Wireless Bluetooth Headphones", price: 59.99, oldPrice: 99.99, rating: 4.5, reviews: 5321, image: img("photo-1505740420928-5e560c06d30e"), category: "electronics" },
  { id: "e2", title: "Smart Watch Fitness Tracker", price: 89.0, oldPrice: 129.0, rating: 4.4, reviews: 3210, image: img("photo-1546868871-7041f2a55e12"), category: "electronics" },
  { id: "e3", title: "4K Action Camera Waterproof", price: 119.99, rating: 4.6, reviews: 1480, image: img("photo-1526406915894-7bcd65f60845"), category: "electronics" },
  { id: "e4", title: "Portable Bluetooth Speaker", price: 39.99, oldPrice: 59.99, rating: 4.5, reviews: 2870, image: img("photo-1608043152269-423dbba4e7e1"), category: "electronics" },
  { id: "e5", title: "Gaming Mechanical Keyboard RGB", price: 74.99, rating: 4.7, reviews: 1965, image: img("photo-1541140532154-b024d705b90a"), category: "electronics" },
  { id: "e6", title: "USB-C Fast Charger 65W", price: 24.99, rating: 4.6, reviews: 4120, image: img("photo-1583394838336-acd977736f90"), category: "electronics" },

  // Home
  { id: "h1", title: "Stainless Steel Cookware Set", price: 149.0, oldPrice: 220.0, rating: 4.6, reviews: 870, image: ("https://media.istockphoto.com/id/184883841/photo/stainless-steel-pan.jpg?s=2048x2048&w=is&k=20&c=GRNeCVx_tFQq148iXqBs0k9p13QVEuJxE3X3OhzpyzQ="), category: "home" },
  { id: "h2", title: "Memory Foam Pillow 2-Pack", price: 39.99, rating: 4.5, reviews: 2150, image: img("photo-1584100936595-c0654b55a2e2"), category: "home" },
  { id: "h3", title: "Aromatherapy Diffuser", price: 27.99, oldPrice: 39.99, rating: 4.7, reviews: 1430, image: img("photo-1602928321679-560bb453f190"), category: "home" },
  { id: "h4", title: "Robot Vacuum Cleaner", price: 199.0, oldPrice: 299.0, rating: 4.4, reviews: 980, image: img("photo-1567690187548-f07b1d7bf5a9"), category: "home" },

  // Toys
  { id: "t1", title: "Building Blocks 1000 Pieces", price: 34.99, rating: 4.7, reviews: 1120, image: img("photo-1587654780291-39c9404d746b"), category: "toys" },
  { id: "t2", title: "Remote Control Race Car", price: 49.99, oldPrice: 69.99, rating: 4.5, reviews: 540, image: img("photo-1558060370-d644479cb6f7"), category: "toys" },
  { id: "t3", title: "Plush Teddy Bear Large", price: 24.99, rating: 4.8, reviews: 320, image: img("photo-1530841377377-3ff06c0ca713"), category: "toys" },
  { id: "t4", title: "Kids Educational Tablet", price: 79.0, rating: 4.3, reviews: 410, image: img("photo-1611162616305-c69b3fa7fbe0"), category: "toys" },

  // Books
  { id: "k1", title: "The Art of Cooking — Hardcover", price: 29.99, rating: 4.7, reviews: 1820, image: img("photo-1544947950-fa07a98d237f"), category: "books" },
  { id: "k2", title: "Bestselling Mystery Novel", price: 14.99, oldPrice: 24.99, rating: 4.5, reviews: 3420, image: img("photo-1543002588-bfa74002ed7e"), category: "books" },
  { id: "k3", title: "Self-Help Guide 2026 Edition", price: 18.5, rating: 4.4, reviews: 980, image: img("photo-1495446815901-a7297e633e8d"), category: "books" },
  { id: "k4", title: "Children's Picture Book Set", price: 22.0, rating: 4.8, reviews: 540, image: img("photo-1512820790803-83ca734da794"), category: "books" },

  // Grocery
  { id: "g1", title: "Organic Coffee Beans 1kg", price: 19.99, rating: 4.6, reviews: 1240, image: img("photo-1559056199-641a0ac8b55e"), category: "grocery" },
  { id: "g2", title: "Extra Virgin Olive Oil 750ml", price: 14.5, rating: 4.7, reviews: 870, image: img("photo-1474979266404-7eaacbcd87c5"), category: "grocery" },
  { id: "g3", title: "Assorted Nuts Mix 500g", price: 12.99, rating: 4.5, reviews: 620, image: img("photo-1599599810769-bcde5a160d32"), category: "grocery" },
  { id: "g4", title: "Premium Dark Chocolate Pack", price: 9.99, oldPrice: 14.99, rating: 4.8, reviews: 410, image: img("photo-1481391319762-47dff72954d9"), category: "grocery" },

  // Sports
  { id: "s1", title: "Yoga Mat Non-Slip 6mm", price: 24.99, rating: 4.6, reviews: 2310, image: img("photo-1601925260368-ae2f83cf8b7f"), category: "sports" },
  { id: "s2", title: "Adjustable Dumbbells 20kg", price: 129.0, oldPrice: 179.0, rating: 4.5, reviews: 980, image: img("photo-1517836357463-d25dfeac3438"), category: "sports" },
  { id: "s3", title: "Running Shoes Lightweight", price: 69.99, rating: 4.4, reviews: 1540, image: img("photo-1542291026-7eec264c27ff"), category: "sports" },
  { id: "s4", title: "Insulated Sports Water Bottle", price: 18.99, rating: 4.7, reviews: 3210, image: img("photo-1602143407151-7111542de6e8"), category: "sports" },
];

export const getProductsByCategory = (slug: string) =>
  PRODUCTS.filter((p) => p.category === slug);

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
