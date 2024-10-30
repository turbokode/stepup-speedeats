import { sendMail } from '../services/mail';

interface CreateOrderMailProps {
  email: string;
  name: string;
  price: string;
  items: string;
}
class CreateOrderMail implements IJob {
  key: string = 'CreateOrderMail';
  async handle(data: any) {
    const { email, items, name, price } = data.data as CreateOrderMailProps;

    await sendMail({
      to: `${name} <${email}>`,
      subject: 'Encomenda criada',
      template: 'createOrder',
      context: {
        name,
        price,
        items
      }
    });
    console.log(' CreateOrderMail Queue executed');
  }
}

export default new CreateOrderMail();
