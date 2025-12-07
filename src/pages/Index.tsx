import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Ноутбук Dell XPS 15',
    price: 89990,
    discount: 10,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
    description: 'Мощный ноутбук для работы и развлечений',
  },
  {
    id: 2,
    name: 'Беспроводные наушники Sony',
    price: 19990,
    category: 'Аудио',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'Премиальное качество звука',
  },
  {
    id: 3,
    name: 'Смартфон Samsung Galaxy',
    price: 54990,
    discount: 15,
    category: 'Телефоны',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
    description: 'Флагман с отличной камерой',
  },
  {
    id: 4,
    name: 'Механическая клавиатура',
    price: 8990,
    category: 'Аксессуары',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    description: 'Профессиональная клавиатура для работы',
  },
  {
    id: 5,
    name: 'Монитор LG UltraWide',
    price: 34990,
    discount: 5,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    description: 'Широкоформатный монитор 34"',
  },
  {
    id: 6,
    name: 'Мышь Logitech MX Master',
    price: 6990,
    category: 'Аксессуары',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
    description: 'Эргономичная беспроводная мышь',
  },
];

const promoCodes = [
  { code: 'WELCOME10', discount: 10 },
  { code: 'SUMMER20', discount: 20 },
  { code: 'SAVE15', discount: 15 },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<number>(0);
  const [activeSection, setActiveSection] = useState('home');

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: 'Товар добавлен в корзину',
      description: product.name,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase()
    );
    if (promo) {
      setAppliedPromo(promo.discount);
      toast({
        title: 'Промокод применен!',
        description: `Скидка ${promo.discount}% активирована`,
      });
    } else {
      toast({
        title: 'Неверный промокод',
        description: 'Проверьте правильность ввода',
        variant: 'destructive',
      });
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemPrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return appliedPromo > 0 ? subtotal * (1 - appliedPromo / 100) : subtotal;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">О нас</h1>
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-4">
                Мы — современный интернет-магазин электроники и аксессуаров с многолетним
                опытом работы на рынке. Наша миссия — предоставлять клиентам качественную
                продукцию по справедливым ценам.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Мы тщательно отбираем товары от проверенных производителей и гарантируем
                подлинность каждого продукта. Наша команда профессионалов всегда готова
                помочь с выбором и ответить на ваши вопросы.
              </p>
            </div>
          </div>
        );
      case 'delivery':
        return (
          <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Доставка</h1>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Truck" size={24} />
                    Курьерская доставка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Доставка по Москве — от 300 руб. Срок доставки: 1-2 дня.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Package" size={24} />
                    Пункты выдачи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Самовывоз из пунктов выдачи по всей России — бесплатно. Срок: 3-5 дней.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Контакты</h1>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={24} className="text-accent" />
                <span className="text-lg">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Mail" size={24} className="text-accent" />
                <span className="text-lg">info@store.ru</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="MapPin" size={24} className="text-accent" />
                <span className="text-lg">Москва, ул. Примерная, д. 1</span>
              </div>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Блог</h1>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Как выбрать ноутбук для работы</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Подробное руководство по выбору ноутбука для профессиональной
                    деятельности...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Топ-5 наушников 2024 года</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Обзор лучших беспроводных наушников текущего года...
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <>
            <section className="bg-primary text-primary-foreground py-20">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold mb-4">
                  Интернет-магазин электроники
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Качественные товары с доставкой по всей России
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setActiveSection('home')}
                  className="hover-scale"
                >
                  Смотреть каталог
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </section>

            <section className="container mx-auto px-4 py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Каталог товаров</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    Доступно промокодов: {promoCodes.length}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover-scale overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.discount && (
                        <Badge className="absolute top-2 right-2 bg-destructive">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <Badge variant="secondary" className="w-fit">
                        {product.category}
                      </Badge>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                      <div>
                        {product.discount ? (
                          <>
                            <p className="text-2xl font-bold text-accent">
                              {(
                                product.price *
                                (1 - product.discount / 100)
                              ).toLocaleString()}{' '}
                              ₽
                            </p>
                            <p className="text-sm text-muted-foreground line-through">
                              {product.price.toLocaleString()} ₽
                            </p>
                          </>
                        ) : (
                          <p className="text-2xl font-bold">
                            {product.price.toLocaleString()} ₽
                          </p>
                        )}
                      </div>
                      <Button onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        Купить
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveSection('home')}
          >
            <Icon name="Store" size={32} className="text-accent" />
            <span className="text-2xl font-bold">TechStore</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => setActiveSection('home')}
              className={activeSection === 'home' ? 'text-accent' : ''}
            >
              Главная
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('about')}
              className={activeSection === 'about' ? 'text-accent' : ''}
            >
              О нас
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('delivery')}
              className={activeSection === 'delivery' ? 'text-accent' : ''}
            >
              Доставка
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('contacts')}
              className={activeSection === 'contacts' ? 'text-accent' : ''}
            >
              Контакты
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('blog')}
              className={activeSection === 'blog' ? 'text-accent' : ''}
            >
              Блог
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon name="ShoppingCart" size={24} />
                  Корзина
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full mt-6">
                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-auto space-y-4">
                      {cart.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{item.name}</h4>
                                <p className="text-sm text-accent font-bold mb-2">
                                  {(item.discount
                                    ? item.price * (1 - item.discount / 100)
                                    : item.price
                                  ).toLocaleString()}{' '}
                                  ₽
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-auto"
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 space-y-4">
                      <Separator />
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Промокод
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Введите промокод"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <Button onClick={applyPromoCode}>Применить</Button>
                        </div>
                        {appliedPromo > 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            Применена скидка {appliedPromo}%
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Подытог:</span>
                          <span>{calculateSubtotal().toLocaleString()} ₽</span>
                        </div>
                        {appliedPromo > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Скидка по промокоду:</span>
                            <span>-{appliedPromo}%</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Итого:</span>
                          <span className="text-accent">
                            {calculateTotal().toLocaleString()} ₽
                          </span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          toast({
                            title: 'Заказ оформлен!',
                            description: 'Спасибо за покупку. Мы свяжемся с вами в ближайшее время.',
                          });
                          setCart([]);
                          setAppliedPromo(0);
                          setPromoCode('');
                        }}
                      >
                        Оформить заказ
                        <Icon name="ArrowRight" size={18} className="ml-2" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>{renderContent()}</main>

      <footer className="bg-muted mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">О компании</h3>
              <p className="text-sm text-muted-foreground">
                Надежный партнер в мире электроники с 2020 года
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Контакты</h3>
              <p className="text-sm text-muted-foreground">+7 (495) 123-45-67</p>
              <p className="text-sm text-muted-foreground">info@store.ru</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Промокоды</h3>
              <div className="space-y-2">
                {promoCodes.map((promo) => (
                  <Badge key={promo.code} variant="outline">
                    {promo.code} (-{promo.discount}%)
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-muted-foreground">
            © 2024 TechStore. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}