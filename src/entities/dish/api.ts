import { supabase } from '@/shared/api/supabase';
import { Dish } from './types';

export const fetchDishes = async (): Promise<Dish[]> => {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const fetchDish = async (id: string): Promise<Dish> => {
  const { data, error } = await supabase.from('dishes').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteDish = async (id: string): Promise<void> => {
  const { error } = await supabase.from('dishes').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
