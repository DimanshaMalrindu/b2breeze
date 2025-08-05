import React, { useState, useEffect } from 'react';
import {
    Wallet,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Download,
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    User,
    Building,
    FileText,
    Upload,
    Plus,
    Grid3X3,
    List,
    SortAsc,
    SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    getBusinessCards,
    deleteBusinessCard,
    updateBusinessCard,
    filterBusinessCards,
    getUniqueCompanies,
    downloadVCard,
    exportAllToCSV,
    initializeSampleBusinessCards,
    addSampleBusinessCards,
    type BusinessCardFilters
} from '@/lib/wallet-utils';
import type { BusinessCardData, ContactFormData } from '@/types/business-card';

interface BusinessCardWalletProps {
    onAddNew?: () => void;
}

export const BusinessCardWallet: React.FC<BusinessCardWalletProps> = ({ onAddNew }) => {
    const [cards, setCards] = useState<BusinessCardData[]>([]);
    const [filteredCards, setFilteredCards] = useState<BusinessCardData[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCard, setSelectedCard] = useState<BusinessCardData | null>(null);
    const [editingCard, setEditingCard] = useState<BusinessCardData | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<BusinessCardFilters>({
        search: '',
        company: '',
        tags: [],
        dateRange: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
    });

    const [editForm, setEditForm] = useState<ContactFormData>({
        name: '',
        company: '',
        title: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        notes: ''
    });

    useEffect(() => {
        loadCards();
    }, []);

    useEffect(() => {
        const filtered = filterBusinessCards(cards, filters);
        setFilteredCards(filtered);
    }, [cards, filters]);

    const loadCards = () => {
        // Initialize sample cards if no cards exist
        initializeSampleBusinessCards();
        const loadedCards = getBusinessCards();
        setCards(loadedCards);
    };

    const handleDeleteCard = (id: string) => {
        if (window.confirm('Are you sure you want to delete this business card?')) {
            deleteBusinessCard(id);
            loadCards();
            if (selectedCard?.id === id) {
                setSelectedCard(null);
            }
        }
    };

    const handleEditCard = (card: BusinessCardData) => {
        setEditingCard(card);
        setEditForm({
            name: card.name,
            company: card.company,
            title: card.title,
            email: card.email,
            phone: card.phone,
            website: card.website || '',
            address: card.address || '',
            notes: card.notes || ''
        });
    };

    const handleSaveEdit = () => {
        if (editingCard) {
            const updatedCard: BusinessCardData = {
                ...editingCard,
                ...editForm,
                updatedAt: new Date()
            };
            updateBusinessCard(updatedCard);
            loadCards();
            setEditingCard(null);
            setSelectedCard(updatedCard);
        }
    };

    const handleFilterChange = (key: keyof BusinessCardFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleSortOrder = () => {
        setFilters(prev => ({
            ...prev,
            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            company: '',
            tags: [],
            dateRange: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        });
    };

    const handleAddSampleCards = () => {
        addSampleBusinessCards();
        loadCards();
    };

    const handleExportAll = () => {
        exportAllToCSV(filteredCards);
    };

    const uniqueCompanies = getUniqueCompanies(cards);

    if (editingCard) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Edit className="w-5 h-5" />
                            Edit Contact
                        </CardTitle>
                        <CardDescription>
                            Update the contact information for {editingCard.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-name">Full Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-company">Company</Label>
                                <Input
                                    id="edit-company"
                                    value={editForm.company}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-title">Job Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter job title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                    id="edit-phone"
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-website">Website</Label>
                                <Input
                                    id="edit-website"
                                    type="url"
                                    value={editForm.website}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                                    placeholder="Enter website URL"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit-address">Address</Label>
                            <Textarea
                                id="edit-address"
                                value={editForm.address}
                                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Enter address"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Textarea
                                id="edit-notes"
                                value={editForm.notes}
                                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Additional notes"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={() => setEditingCard(null)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} className="flex-1" disabled={!editForm.name}>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (selectedCard) {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => setSelectedCard(null)}>
                        ← Back to Wallet
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditCard(selectedCard)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => downloadVCard(selectedCard)}>
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteCard(selectedCard.id)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <User className="w-6 h-6" />
                                    {selectedCard.name}
                                </CardTitle>
                                <CardDescription>
                                    {selectedCard.title} {selectedCard.company && `at ${selectedCard.company}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedCard.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Email</p>
                                                <a href={`mailto:${selectedCard.email}`} className="text-sm text-primary hover:underline">
                                                    {selectedCard.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {selectedCard.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Phone</p>
                                                <a href={`tel:${selectedCard.phone}`} className="text-sm text-primary hover:underline">
                                                    {selectedCard.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {selectedCard.company && (
                                        <div className="flex items-center gap-3">
                                            <Building className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Company</p>
                                                <p className="text-sm">{selectedCard.company}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedCard.website && (
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Website</p>
                                                <a
                                                    href={selectedCard.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {selectedCard.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {selectedCard.address && (
                                        <div className="flex items-start gap-3 md:col-span-2">
                                            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium">Address</p>
                                                <p className="text-sm">{selectedCard.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Added</p>
                                            <p className="text-sm">{new Date(selectedCard.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedCard.notes && (
                                    <div className="border-t pt-4">
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium mb-2">Notes</p>
                                                <p className="text-sm text-muted-foreground">{selectedCard.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Original Business Card & Photos */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Original Business Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={selectedCard.originalCardImage}
                                    alt="Original business card"
                                    className="w-full rounded-lg border"
                                />
                            </CardContent>
                        </Card>

                        {selectedCard.customerPhoto && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Customer Photo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={selectedCard.customerPhoto}
                                        alt="Customer"
                                        className="w-full rounded-lg border"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {selectedCard.inquiryPhoto && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Inquiry Note</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={selectedCard.inquiryPhoto}
                                        alt="Inquiry note"
                                        className="w-full rounded-lg border"
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Wallet className="w-6 h-6" />
                        Business Card Wallet
                    </h1>
                    <p className="text-muted-foreground">
                        {cards.length} {cards.length === 1 ? 'contact' : 'contacts'} in your B2BBreeze wallet
                    </p>
                </div>
                <div className="flex gap-2">
                    {cards.length < 3 && (
                        <Button variant="secondary" onClick={handleAddSampleCards}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Sample Cards
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleExportAll} disabled={cards.length === 0}>
                        <Upload className="w-4 h-4 mr-2" />
                        Export All
                    </Button>
                    <Button onClick={onAddNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search contacts by name, company, email, or phone..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Toggle and View Options */}
                        <div className="flex justify-between items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                <div>
                                    <Label>Company</Label>
                                    <Select
                                        value={filters.company}
                                        onChange={(e) => handleFilterChange('company', e.target.value)}
                                        placeholder="All companies"
                                    >
                                        <option value="">All companies</option>
                                        {uniqueCompanies.map(company => (
                                            <option key={company} value={company}>{company}</option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <Label>Date Added</Label>
                                    <Select
                                        value={filters.dateRange}
                                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                    >
                                        <option value="all">All time</option>
                                        <option value="week">Last week</option>
                                        <option value="month">Last month</option>
                                        <option value="year">Last year</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Sort by</Label>
                                    <Select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    >
                                        <option value="name">Name</option>
                                        <option value="company">Company</option>
                                        <option value="date">Date Added</option>
                                        <option value="recent">Recently Updated</option>
                                    </Select>
                                </div>

                                <div className="flex items-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleSortOrder}
                                        className="flex items-center gap-1"
                                    >
                                        {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                                        {filters.sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Cards Display */}
            {filteredCards.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {cards.length === 0 ? 'No business cards yet' : 'No cards match your filters'}
                        </h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {cards.length === 0
                                ? 'Start by scanning your first business card to build your professional network.'
                                : 'Try adjusting your search terms or filters to find the contacts you\'re looking for.'
                            }
                        </p>
                        {cards.length === 0 && (
                            <Button onClick={onAddNew}>
                                <Plus className="w-4 h-4 mr-2" />
                                Scan First Card
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'space-y-2'
                }>
                    {filteredCards.map((card) => (
                        <Card
                            key={card.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${viewMode === 'list' ? 'p-0' : ''
                                }`}
                            onClick={() => setSelectedCard(card)}
                        >
                            {viewMode === 'grid' ? (
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{card.name}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{card.title}</p>
                                            <p className="text-sm font-medium text-primary truncate">{card.company}</p>
                                        </div>
                                        <div className="relative ml-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle dropdown menu
                                                }}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        {card.email && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{card.email}</span>
                                            </div>
                                        )}
                                        {card.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                <span>{card.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-xs text-muted-foreground">
                                            Added {new Date(card.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                            ) : (
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold truncate">{card.name}</h3>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {card.title} {card.company && `• ${card.company}`}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        {card.email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="hidden sm:inline">{card.email}</span>
                                                            </div>
                                                        )}
                                                        {card.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                <span className="hidden sm:inline">{card.phone}</span>
                                                            </div>
                                                        )}
                                                        <span className="text-xs">
                                                            {new Date(card.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle dropdown menu
                                            }}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
