<script>
	import { syncStatus, lastSync, syncError } from '$lib/stores/syncStore.js';
	
	$: statusIcon = getStatusIcon($syncStatus);
	$: statusText = getStatusText($syncStatus);
	$: statusColor = getStatusColor($syncStatus);
	
	function getStatusIcon(status) {
		switch (status) {
			case 'syncing':
				return '⟳';
			case 'synced':
				return '✓';
			case 'error':
				return '✗';
			case 'offline':
				return '○';
			default:
				return '○';
		}
	}
	
	function getStatusText(status) {
		switch (status) {
			case 'syncing':
				return 'Syncing...';
			case 'synced':
				return 'Synced';
			case 'error':
				return 'Sync error';
			case 'offline':
				return 'Offline';
			default:
				return '';
		}
	}
	
	function getStatusColor(status) {
		switch (status) {
			case 'syncing':
				return '#0969da';
			case 'synced':
				return '#1a7f37';
			case 'error':
				return '#cf222e';
			case 'offline':
				return '#656d76';
			default:
				return '#656d76';
		}
	}
	
	function formatLastSync(timestamp) {
		if (!timestamp) return '';
		
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		
		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		
		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h ago`;
		
		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays}d ago`;
	}
</script>

{#if $syncStatus !== 'idle'}
	<div class="sync-status" style="--status-color: {statusColor}">
		<span class="status-icon" class:spinning={$syncStatus === 'syncing'}>
			{statusIcon}
		</span>
		<span class="status-text">
			{statusText}
		</span>
		{#if $lastSync && $syncStatus === 'synced'}
			<span class="last-sync">
				{formatLastSync($lastSync)}
			</span>
		{/if}
		{#if $syncError && $syncStatus === 'error'}
			<span class="error-text" title={$syncError}>
				{$syncError}
			</span>
		{/if}
	</div>
{/if}

<style>
	.sync-status {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 12px;
		font-size: 12px;
		color: var(--status-color);
	}
	
	.status-icon {
		font-size: 14px;
		line-height: 1;
	}
	
	.status-icon.spinning {
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.status-text {
		font-weight: 500;
	}
	
	.last-sync {
		color: #656d76;
		font-size: 11px;
	}
	
	.error-text {
		color: #cf222e;
		font-size: 11px;
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
