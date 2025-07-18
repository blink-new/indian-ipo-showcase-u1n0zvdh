import { Calendar, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { IPO } from '../data/mockData';

interface IPOCardProps {
  ipo: IPO;
  onViewDetails: (id: string) => void;
}

export function IPOCard({ ipo, onViewDetails }: IPOCardProps) {
  const getStatusColor = (status: IPO['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'listed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: IPO['status']) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-3 h-3" />;
      case 'open': return <AlertCircle className="w-3 h-3" />;
      case 'closed': return <CheckCircle className="w-3 h-3" />;
      case 'listed': return <TrendingUp className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return `₹${(amount / 10000).toFixed(1)}L Cr`;
    }
    return `₹${amount.toLocaleString()} Cr`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {ipo.companyName}
              </h3>
              <Badge className={`text-xs ${getStatusColor(ipo.status)}`}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(ipo.status)}
                  {ipo.status.toUpperCase()}
                </span>
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{ipo.sector} • {ipo.industry}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Range */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Price Range</p>
            <p className="font-semibold text-gray-900">
              ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Issue Size</p>
            <p className="font-semibold text-gray-900">{formatCurrency(ipo.issueSize)}</p>
          </div>
        </div>

        {/* Subscription Status */}
        {ipo.subscriptionStatus && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Overall Subscription</p>
              <p className="font-semibold text-gray-900">{ipo.subscriptionStatus.overall}x</p>
            </div>
            <Progress 
              value={Math.min(ipo.subscriptionStatus.overall * 20, 100)} 
              className="h-2"
            />
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div className="text-center">
                <p className="text-gray-500">Retail</p>
                <p className="font-medium">{ipo.subscriptionStatus.retail}x</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">QIB</p>
                <p className="font-medium">{ipo.subscriptionStatus.qib}x</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">NII</p>
                <p className="font-medium">{ipo.subscriptionStatus.nii}x</p>
              </div>
            </div>
          </div>
        )}

        {/* GMP and Listing */}
        {(ipo.gmp || ipo.listing) && (
          <div className="flex items-center justify-between">
            {ipo.gmp && (
              <div>
                <p className="text-sm text-gray-600">GMP</p>
                <p className={`font-semibold flex items-center gap-1 ${
                  ipo.gmp > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {ipo.gmp > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  ₹{Math.abs(ipo.gmp)}
                </p>
              </div>
            )}
            {ipo.listing && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Listing Gain</p>
                <p className={`font-semibold flex items-center gap-1 ${
                  ipo.listing.gain > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {ipo.listing.gain > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {ipo.listing.gain.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key Dates */}
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-700">Key Dates</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-500">Open</p>
              <p className="font-medium">{formatDate(ipo.openDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Close</p>
              <p className="font-medium">{formatDate(ipo.closeDate)}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onViewDetails(ipo.id)}
          className="w-full"
          variant="outline"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}