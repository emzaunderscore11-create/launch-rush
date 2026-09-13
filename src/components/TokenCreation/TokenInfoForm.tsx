'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea, Card, Alert, Badge } from '@/components/UI';
import { useLaunchStore } from '@/store/launchStore';
import { TokenMetadata } from '@/types';
import { truncateText } from '@/lib/utils/format';

interface TokenInfoFormProps {
  onSubmit: (metadata: TokenMetadata) => void;
  isLoading?: boolean;
}

export const TokenInfoForm: React.FC<TokenInfoFormProps> = ({ onSubmit, isLoading = false }) => {
  const { updateTokenConfig } = useLaunchStore();
  const [formData, setFormData] = useState<Partial<TokenMetadata>>({
    name: '',
    symbol: '',
    description: '',
    logo: '',
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof TokenMetadata, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        handleInputChange('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Token name is required';
    if (!formData.symbol?.trim()) newErrors.symbol = 'Token symbol is required';
    if (formData.symbol && formData.symbol.length > 10) newErrors.symbol = 'Symbol must be 10 characters or less';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.logo) newErrors.logo = 'Logo is required';

    if (formData.twitter && !formData.twitter.includes('twitter.com') && !formData.twitter.includes('x.com')) {
      newErrors.twitter = 'Invalid Twitter URL';
    }
    if (formData.telegram && !formData.telegram.includes('t.me')) {
      newErrors.telegram = 'Invalid Telegram URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateTokenConfig({ metadata: formData as TokenMetadata });
      onSubmit(formData as TokenMetadata);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">Token Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Token Logo *</label>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <img src={logoPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="flex-1 px-4 py-2 bg-dark border border-secondary/30 rounded-lg text-gray-400 cursor-pointer"
            />
          </div>
          {errors.logo && <div className="text-error text-sm mt-1">{errors.logo}</div>}
        </div>

        {/* Token Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Token Name *</label>
          <Input
            type="text"
            placeholder="e.g., Doge Inu"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            maxLength={50}
          />
          {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Symbol (Ticker) *</label>
          <Input
            type="text"
            placeholder="e.g., DOGE"
            value={formData.symbol || ''}
            onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
            maxLength={10}
          />
          {errors.symbol && <div className="text-error text-sm mt-1">{errors.symbol}</div>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Description *</label>
          <Textarea
            placeholder="Describe your meme token"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            maxLength={500}
            rows={4}
          />
          <div className="text-xs text-gray-400 mt-1">
            {formData.description?.length || 0}/500
          </div>
          {errors.description && <div className="text-error text-sm mt-1">{errors.description}</div>}
        </div>

        {/* Social Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Website (Optional)</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Twitter/X (Optional)</label>
            <Input
              type="url"
              placeholder="https://twitter.com/your_handle"
              value={formData.twitter || ''}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
            />
            {errors.twitter && <div className="text-error text-sm mt-1">{errors.twitter}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Telegram (Optional)</label>
            <Input
              type="url"
              placeholder="https://t.me/your_group"
              value={formData.telegram || ''}
              onChange={(e) => handleInputChange('telegram', e.target.value)}
            />
            {errors.telegram && <div className="text-error text-sm mt-1">{errors.telegram}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Discord (Optional)</label>
            <Input
              type="url"
              placeholder="https://discord.gg/your_server"
              value={formData.discord || ''}
              onChange={(e) => handleInputChange('discord', e.target.value)}
            />
          </div>
        </div>

        <Alert
          variant="warning"
          title="Honest Disclosure"
          message="All information you provide will be publicly visible. Never make false claims about guaranteed profits or buyers."
        />

        <Button type="submit" fullWidth variant="primary" size="lg" isLoading={isLoading}>
          Continue to Supply Configuration →
        </Button>
      </form>
    </Card>
  );
};
