import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Download,
    Grid3X3,
    List,
    Users,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CustomerContact, CustomerFolder } from '@/types/customer';
import {
    getCustomers,
    getFolders,
    initializeSampleCustomers,
    searchCustomers,
    filterCustomersByFolder,
    exportToCSV
} from '@/lib/customer-utils';

interface CustomerDirectoryPageProps {
    onNavigate: (page: string) => void;
}

export const CustomerDirectoryPage: React.FC<CustomerDirectoryPageProps> = ({ onNavigate }) => {
    const [customers, setCustomers] = useState<CustomerContact[]>([]);
    const [folders, setFolders] = useState<CustomerFolder[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        initializeSampleCustomers();
        loadData();
    }, []);

    const loadData = () => {
        const loadedCustomers = getCustomers();
        const loadedFolders = getFolders();
        setCustomers(loadedCustomers);
        setFolders(loadedFolders);
    };

    const filteredCustomers = React.useMemo(() => {
        let filtered = searchCustomers(customers, searchQuery);
        filtered = filterCustomersByFolder(filtered, selectedFolder);
        return filtered;
    }, [customers, searchQuery, selectedFolder]);

    const handleBackToHome = () => {
        onNavigate('home');
    };

    const handleExport = () => {
        exportToCSV(filteredCustomers);
    };

    const selectedFolderName = folders.find(f => f.id === selectedFolder)?.name;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Customer Directory</h1>
                        <p className="text-muted-foreground">
                            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} managed with B2BBreeze
                            {selectedFolderName && ` in "${selectedFolderName}"`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button size="sm" onClick={() => alert('Add Customer feature coming soon!')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Customer
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Folder Filter */}
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedFolder === undefined ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedFolder(undefined)}
                                >
                                    All Folders
                                </Button>
                                {folders.map(folder => (
                                    <Button
                                        key={folder.id}
                                        variant={selectedFolder === folder.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedFolder(folder.id)}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: folder.color }}
                                        />
                                        {folder.name}
                                    </Button>
                                ))}
                            </div>

                            {/* View Mode */}
                            <div className="flex gap-1 border rounded-md p-1">
                                <Button
                                    size="sm"
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    onClick={() => setViewMode('grid')}
                                    className="px-2"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    onClick={() => setViewMode('list')}
                                    className="px-2"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Folder Stats */}
                {folders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {folders.map(folder => {
                            const folderContactCount = customers.filter(c => c.folderId === folder.id).length;
                            return (
                                <Card
                                    key={folder.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedFolder === folder.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => setSelectedFolder(selectedFolder === folder.id ? undefined : folder.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: folder.color }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{folder.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {folderContactCount} contact{folderContactCount !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Customer List/Grid */}
                {filteredCustomers.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery || selectedFolder
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Start by adding your first customer to the directory'
                                }
                            </p>
                            <Button onClick={() => alert('Add Customer feature coming soon!')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Customer
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                    }>
                        {filteredCustomers.map(customer => {
                            const folder = folders.find(f => f.id === customer.folderId);

                            if (viewMode === 'list') {
                                return (
                                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-primary">
                                                        {customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-foreground truncate">{customer.name}</h3>
                                                        {folder && (
                                                            <span
                                                                className="text-xs px-2 py-1 rounded-full"
                                                                style={{ backgroundColor: folder.color + '20', color: folder.color }}
                                                            >
                                                                {folder.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="truncate">{customer.company}</span>
                                                        <span>{customer.phone}</span>
                                                        <span className="truncate">{customer.email}</span>
                                                        <span>{customer.country}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {customer.inquiryDescription && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {customer.inquiryDescription}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            }

                            return (
                                <Card key={customer.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-primary">
                                                        {customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground">{customer.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{customer.company}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {folder && (
                                            <span
                                                className="w-fit text-xs px-2 py-1 rounded-full mt-2 inline-block"
                                                style={{ backgroundColor: folder.color + '20', color: folder.color }}
                                            >
                                                {folder.name}
                                            </span>
                                        )}
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">Phone:</span>
                                                <span>{customer.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">Email:</span>
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">Country:</span>
                                                <span>{customer.country}</span>
                                            </div>
                                        </div>

                                        {customer.inquiryDescription && (
                                            <div className="pt-2 border-t">
                                                <p className="text-sm text-muted-foreground line-clamp-3">
                                                    {customer.inquiryDescription}
                                                </p>
                                            </div>
                                        )}

                                        {customer.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-2">
                                                {customer.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="text-xs px-2 py-1 bg-secondary rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {customer.tags.length > 3 && (
                                                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                                                        +{customer.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => alert('Edit feature coming soon!')}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => alert('Share feature coming soon!')}
                                            >
                                                Share
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-destructive hover:text-destructive"
                                                onClick={() => alert('Delete feature coming soon!')}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
