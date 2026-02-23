import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
    {
        name: 'AirPods Pro (2da Gen) Réplica Premium',
        description: 'Auriculares inalámbricos con cancelación activa de ruido y audio espacial calibrado.',
        price: 120000,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop',
        isNew: true,
        stock: 50
    },
    {
        name: 'Smartwatch Series 9 Style',
        description: 'Reloj inteligente con monitor de ritmo cardíaco, oxímetro y notificaciones integradas.',
        price: 150000,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop',
        isNew: true,
        stock: 30
    },
    {
        name: 'Cargador Inalámbrico MagSafe',
        description: 'Estación de carga rápida magnética para iPhone y accesorios compatibles con Qi.',
        price: 85000,
        category: 'Accesorios',
        image: 'https://images.unsplash.com/photo-1622350700142-fbf349edb8eb?q=80&w=600&auto=format&fit=crop',
        isNew: false,
        stock: 100
    },
    {
        name: 'Audífonos Max Diadema',
        description: 'Auriculares circumaurales con alta fidelidad extrema y cojines de espuma viscoelástica.',
        price: 190000,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop',
        isNew: false,
        stock: 20
    },
    {
        name: 'Batería Portátil Magnética',
        description: 'Power bank ultradelgado con acoplamiento magnético directo. Capacidad de 10000mAh.',
        price: 95000,
        category: 'Accesorios',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop',
        isNew: false,
        stock: 40
    },
    {
        name: 'Smartwatch Ultra Pro',
        description: 'Edición deportiva ultra resistente, con carcasa de titanio y batería de larga duración.',
        price: 180000,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop',
        isNew: true,
        stock: 15
    }
];

async function main() {
    console.log('Iniciando carga de datos semilla (Seed)...');

    // Limpiar base de datos si es necesario (opcional)
    // await prisma.orderItem.deleteMany();
    // await prisma.order.deleteMany();
    // await prisma.product.deleteMany();

    for (const product of initialProducts) {
        const created = await prisma.product.create({
            data: product
        });
        console.log(`Producto creado: ${created.name}`);
    }

    console.log('¡Base de datos alimentada exitosamente!');
}

main()
    .catch((e) => {
        console.error('Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
